import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  INestApplication,
  Logger,
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

  @Get('bad-request')
  badRequest() {
    throw new BadRequestException('SQLSTATE: sensitive-internal-detail');
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

  @Get('untrusted-status')
  untrustedStatus() {
    throw Object.assign(new Error('sensitive-internal-detail'), {
      status: 413,
    });
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

  let logError: jest.SpyInstance;

  beforeEach(() => {
    logError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
        code: 'BAD_REQUEST',
        message: 'The request could not be processed.',
      });
  });

  it('normalizes non-validation HTTP 400 without exposing exception details', async () => {
    await request(app.getHttpServer())
      .get('/boundary/bad-request')
      .expect(400)
      .expect({
        code: 'BAD_REQUEST',
        message: 'The request could not be processed.',
      });
    expect(logError).not.toHaveBeenCalled();
  });

  it.each([
    [
      'oversized JSON',
      undefined,
      { label: 'x'.repeat(110 * 1024), count: 2 },
      413,
    ],
    ['unsupported charset', 'application/json; charset=iso-8859-1', '{}', 415],
  ])(
    'preserves parser status for %s without logging internal failure',
    async (_, contentType, body, status) => {
      const req = request(app.getHttpServer()).post('/boundary');
      if (contentType) req.set('Content-Type', contentType);
      await req.send(body).expect(status).expect({
        code: 'HTTP_ERROR',
        message: 'The request could not be completed.',
      });
      expect(logError).not.toHaveBeenCalled();
    },
  );

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

  it('does not log expected client errors as server failures', async () => {
    await request(app.getHttpServer()).post('/boundary').send({}).expect(400);
    await request(app.getHttpServer()).get('/boundary/missing').expect(404);
    await request(app.getHttpServer()).get('/boundary/conflict').expect(409);
    expect(logError).not.toHaveBeenCalled();
  });

  it.each([
    '/boundary/unexpected',
    '/boundary/http-server-error',
    '/boundary/untrusted-status',
  ])(
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
      expect(logError).toHaveBeenCalledTimes(1);
      expect(logError).toHaveBeenCalledWith(
        path === '/boundary/http-server-error'
          ? 'HTTP request failed: HTTP exception; status=500'
          : 'HTTP request failed: unexpected exception; status=500',
      );
    },
  );
});
