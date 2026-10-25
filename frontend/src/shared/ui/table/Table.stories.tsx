import type { Meta, StoryObj } from '@storybook/react-vite'

import MoreVerticalIcon from '@/shared/assets/icons/more-vertical.svg?react'
import IconButton from '@/shared/ui/icon-button'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

const meta = {
  title: 'Shared/UI/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Compose Table, TableRow and TableCell with native thead and tbody elements. Hover a data cell to inspect its background. Status badges below are story-only placeholders; action controls reuse IconButton with the project MoreVertical icon.',
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <Table {...args} aria-label="Items">
      <thead>
        <TableRow>
          <TableCell header>Name</TableCell>
          <TableCell header>Reference</TableCell>
          <TableCell header>Created</TableCell>
        </TableRow>
      </thead>
      <tbody>
        <TableRow>
          <TableCell>First item</TableCell>
          <TableCell>ITEM-001</TableCell>
          <TableCell>28.04.2024</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Second item</TableCell>
          <TableCell>ITEM-002</TableCell>
          <TableCell>29.04.2024</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Third item</TableCell>
          <TableCell>ITEM-003</TableCell>
          <TableCell>30.04.2024</TableCell>
        </TableRow>
      </tbody>
    </Table>
  ),
}

export const WithStatusAndActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'TMS mock data with local demonstration status badges and the project MoreVertical icon passed to IconButton. Status badges remain local demonstration placeholders. IconButton provides its standard interaction feedback; no action menu is implemented yet.',
      },
    },
  },
  render: (args) => (
    <Table {...args} aria-label="Маршруты и рейсы">
      <colgroup>
        <col />
        <col />
        <col />
        <col className="w-12" />
      </colgroup>
      <thead>
        <TableRow>
          <TableCell header>Маршрут</TableCell>
          <TableCell header>Рейс</TableCell>
          <TableCell header>Статус</TableCell>
          <TableCell header>
            <span className="sr-only">Actions</span>
          </TableCell>
        </TableRow>
      </thead>
      <tbody>
        {[
          {
            route: 'РЦ Москва → Тверь',
            trip: 'TR-000124',
            status: 'Created',
            badgeClassName: 'bg-status-created-soft text-status-created',
          },
          {
            route: 'РЦ Казань → Чебоксары',
            trip: 'TR-000125',
            status: 'Assigned',
            badgeClassName: 'bg-status-assigned-soft text-status-assigned',
          },
          {
            route: 'РЦ Москва → Санкт-Петербург',
            trip: 'TR-000126',
            status: 'In Transit',
            badgeClassName: 'bg-status-in-transit-soft text-status-in-transit',
          },
          {
            route: 'РЦ Екатеринбург → Пермь',
            trip: 'TR-000127',
            status: 'Completed',
            badgeClassName: 'bg-status-completed-soft text-status-completed',
          },
        ].map(({ route, trip, status, badgeClassName }) => (
          <TableRow key={trip}>
            <TableCell>{route}</TableCell>
            <TableCell>{trip}</TableCell>
            <TableCell>
              <span
                className={`inline-flex h-6 items-center rounded-control px-2 text-xs leading-4 ${badgeClassName}`}
              >
                {status}
              </span>
            </TableCell>
            <TableCell className="hover:bg-surface!">
              <div className="flex justify-center">
                <IconButton
                  aria-label={`Действия для рейса ${trip}`}
                  icon={
                    <MoreVerticalIcon className="size-5" aria-hidden="true" />
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
}
