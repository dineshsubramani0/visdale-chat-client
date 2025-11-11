import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { logout } from '@/lib/logout';
import { ModeToggle } from '../theme/mode-toggle';

export function SiteHeader() {
  return (
    <header className="p-2 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="cursor-pointer p-2   hover:text-white"
            variant="outline"
            onClick={() => {
              // Call the logout function here
              logout();
            }}>
            Logout
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between h-16 gap-4 pr-4 shrink-0">
        <ModeToggle />
      </div>
    </header>
  );
}
