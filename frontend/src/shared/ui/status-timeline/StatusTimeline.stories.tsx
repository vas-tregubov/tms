import type { Meta, StoryObj } from '@storybook/react-vite'

import StatusTimeline, { TimelineItem } from '@/shared/ui/status-timeline'

const meta = {
  title: 'Shared/UI/StatusTimeline',
  component: StatusTimeline,
  subcomponents: { TimelineItem },
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[559px] max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic ordered sequence composed from TimelineItem children. Each item takes status, dateTime and author strings. The completed/pending state describes progress within the timeline UI, independently of Route or Trip business status. The default is pending. The caller explicitly sets showConnector={false} on the final item. Date/time text is supplied already formatted; no timezone or machine-readable timestamp is inferred.',
      },
    },
  },
} satisfies Meta<typeof StatusTimeline>

export default meta

type Story = StoryObj<typeof meta>

export const PendingItem: Story = {
  args: {
    children: (
      <TimelineItem
        status="Создан"
        dateTime="28.04.2024 10:24"
        author="Алексей Петров"
      />
    ),
  },
}

export const CompletedItem: Story = {
  args: {
    children: (
      <TimelineItem
        status="Создан"
        dateTime="28.04.2024 10:24"
        author="Алексей Петров"
        state="completed"
      />
    ),
  },
}

export const Timeline: Story = {
  args: {
    children: (
      <>
        <TimelineItem
          status="Создан"
          dateTime="28.04.2024 10:24"
          author="Алексей Петров"
          state="completed"
        />
        <TimelineItem
          status="Назначен"
          dateTime="28.04.2024 11:05"
          author="Алексей Петров"
          state="completed"
        />
        <TimelineItem
          status="В пути"
          dateTime="28.04.2024 12:30"
          author="Иванов С. А."
          state="completed"
        />
        <TimelineItem
          status="Завершён"
          dateTime="29.04.2024 16:30"
          author="Иванов С. А."
          showConnector={false}
        />
      </>
    ),
  },
}
