import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Icon } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

// Define the type for each item
type NavItem = {
  readonly title: string;
  readonly url: string;
  readonly icon?: Icon;
};

// Mark props as readonly
interface NavMainProps {
  readonly items: readonly NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <NavLink
                  to={item.url ?? '#'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-4 px-2 py-1 rounded-md 
             ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted hover:text-foreground'}`
                  }>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
