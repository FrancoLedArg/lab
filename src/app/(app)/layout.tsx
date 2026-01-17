// Components
import { AppSidebar } from "@/components/app-sidebar";

// Shadcn
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Auth
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={session.user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                Sistema de Gestión de Laboratorio
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
