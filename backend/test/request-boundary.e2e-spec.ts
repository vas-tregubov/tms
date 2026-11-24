import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  INestApplication,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import type { ApiError } from '../src/http/api-error';

class ItemDto {
  @IsDefined()
  @IsString({
    message: 'A validator message containing $value must not be exposed.',
  })
  name!: string;
}

class RequestDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsDefined()
  @IsInt()
  count!: number;

  @IsOptional()
  @IsString()
  note?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items?: ItemDto[];
}

// Test-only HTTP fixtures: no production endpoints or business DTOs are added.
@Controller('boundary')
class BoundaryController {
  @Post()
  create(@Body() dto: RequestDto) {
    return {
      transformed: dto instanceof RequestDto,
      label: dto.label,
      note: dto.note,
    };
  }

  @Get('missing')
  missing() {
    throw new NotFoundException('sensitive-internal-detail');
  }

  @Get('conflict')
  conflict() {
    // Business validation is represented by a service/controller exception,
    // independently of transport DTO validation.
    throw new ConflictException('sensitive-internal-detail');
  }

  @Get('unexpected')
  unexpected() {
    throw new Error('SQLSTATE 23505: sensitive-internal-detail');
  }

  @Get('http-server-error')
  serverError() {
    throw new HttpException(
      { message: 'sensitive-internal-detail', stack: 'private-stack' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

describe('global HTTP request boundary', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [BoundaryController],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('transforms valid JSON into a DTO instance without changing field types', async () => {
    await request(app.getHttpServer())
      .post('/boundary')
      .send({ label: 'Valid', count: 2, note: null })
      .expect(201)
      .expect({ transformed: true, label: 'Valid', note: null });
  });

  it.each([
    [{ label: 'Valid', count: '2' }, 'count', 'INVALID_VALUE'],
    [{ count: 2 }, 'label', 'REQUIRED_FIELD'],
    [
      { label: 'Valid', count: 2, extra: 'sensitive-internal-detail' },
      'extra',
      'UNKNOWN_PROPERTY',
    ],
    [
      { label: 'Valid', count: 2, items: [{ name: 42 }] },
      'items[0].name',
      'INVALID_VALUE',
    ],
    [{}, 'label', 'REQUIRED_FIELD'],
  ])(
    'rejects invalid, missing or unknown fields without echoing input',
    async (body, field, code) => {
      const response = await request(app.getHttpServer())
        .post('/boundary')
        .send(body)
        .expect(400);
      const error = response.body as ApiError;
      expect(error).toMatchObject({
        code: 'VALIDATION_ERROR',
        message: 'The request contains invalid fields.',
      });
      expect(Object.keys(error).sort()).toEqual(['code', 'details', 'message']);
      expect(JSON.stringify(error)).not.toMatch(
        /sensitive-internal-detail|validator message|target|stack/,
      );
      const details = error.details ?? [];
      expect(
        details.some(
          (detail) => detail.field === field && detail.code === code,
        ),
      ).toBe(true);
      expect(
        details.every(
          (detail) =>
            Object.keys(detail).sort().join(',') === 'code,field,message',
        ),
      ).toBe(true);
    },
  );

  it('normalizes malformed JSON without exposing parser details', async () => {
    await request(app.getHttpServer())
      .post('/boundary')
      .set('Content-Type', 'application/json')
      .send('{invalid-json')
      .expect(400)
      .expect({
        code: 'VALIDATION_ERROR',
        message: 'The request contains invalid fields.',
      });
  });

  it.each(['/boundary/missing', '/unknown-resource'])(
    'returns the API 404 contract for %s',
    async (path) => {
      await request(app.getHttpServer()).get(path).expect(404).expect({
        code: 'RESOURCE_NOT_FOUND',
        message: 'The requested resource was not found.',
      });
    },
  );

  it('normalizes business conflicts independently of DTO validation', async () => {
    await request(app.getHttpServer())
      .get('/boundary/conflict')
      .expect(409)
      .expect({
        code: 'BUSINESS_CONFLICT',
        message: 'The request conflicts with the current resource state.',
      });
  });

  it.each(['/boundary/unexpected', '/boundary/http-server-error'])(
    'hides internal exceptions and does not echo a client request ID: %s',
    async (path) => {
      await request(app.getHttpServer())
        .get(path)
        .set('X-Request-Id', 'client-controlled-id')
        .expect(500)
        .expect({
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred.',
        });
    },
  );
});
