import type { Meta, StoryObj } from '@storybook/react-vite'

import Breadcrumbs from '@/shared/ui/breadcrumbs'

const meta = {
  title: 'Shared/UI/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    items: [
      { id: 'home', label: 'Главная', href: '/' },
      { id: 'routes', label: 'Маршруты', href: '/routes' },
      { id: 'route', label: 'MR-000123' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'The last item is the current page. Items with href render as links. Long labels are truncated with an ellipsis; the full text is available in the title.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

export const OneItem: Story = {
  args: {
    items: [{ id: 'home', label: 'Главная' }],
  },
}

export const TwoItems: Story = {
  args: {
    items: [
      { id: 'home', label: 'Главная', href: '/' },
      { id: 'routes', label: 'Маршруты' },
    ],
  },
}

export const ThreeItems: Story = {}

export const TenItems: Story = {
  args: {
    items: Array.from({ length: 10 }, (_, index) => ({
      id: `item-${index + 1}`,
      label: `Раздел ${index + 1}`,
      href: index < 9 ? `/section-${index + 1}` : undefined,
    })),
  },
}

export const LongLabels: Story = {
  args: {
    items: [
      { id: 'home', label: 'Главная', href: '/' },
      {
        id: 'distribution-centers',
        label: 'Распределительные центры Центрального федерального округа',
        href: '/distribution-centers',
      },
      {
        id: 'distribution-center',
        label: 'Распределительный центр «Подольск», Московская область',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-80">
        <Story />
      </div>
    ),
  ],
}
