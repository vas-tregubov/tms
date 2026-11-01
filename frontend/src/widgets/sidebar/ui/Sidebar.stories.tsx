import type { Meta, StoryObj } from '@storybook/react-vite'

import Sidebar from '@/widgets/sidebar'

const meta = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    hrefs: {
      home: '#home',
      routes: '#routes',
      trips: '#trips',
      directories: '#directories',
      reports: '#reports',
      settings: '#settings',
    },
    activeItem: 'routes',
  },
  argTypes: {
    activeItem: {
      control: 'select',
      options: [
        'home',
        'routes',
        'trips',
        'directories',
        'reports',
        'settings',
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[640px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application navigation composed from the shared SidebarItem and existing icons. Matches the 240px Figma Sidebar; the parent supplies its height. Supply hrefs and activeItem explicitly. Links use native anchor navigation; the widget does not inspect the URL or implement routing. Settings stays at the bottom, with scrolling available when the parent is short.',
      },
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
