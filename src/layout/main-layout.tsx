// app/layout.tsx

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/header';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import '@/styles/globals.css';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <section className="bg-(--current-theme-bg) min-h-[calc(100vh-64px)]">
          <Outlet></Outlet>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
