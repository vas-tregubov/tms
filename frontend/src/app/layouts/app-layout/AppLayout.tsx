import type { ComponentProps, ReactNode } from 'react'

import Header from '@/widgets/header'
import Sidebar from '@/widgets/sidebar'

type AppLayoutProps = {
  sidebar: ComponentProps<typeof Sidebar>
  header: ComponentProps<typeof Header>
  children: ReactNode
}

const AppLayout = ({ sidebar, header, children }: AppLayoutProps) => (
  <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
    <Header {...header} />
    <div className="flex min-h-0 min-w-0 flex-1">
      <Sidebar {...sidebar} />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto p-5">
        {children}
      </main>
    </div>
  </div>
)

export default AppLayout
