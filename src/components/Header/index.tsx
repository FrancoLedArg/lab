import Link from "next/link";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className='flex items-center justify-between'>
      <NavigationMenu>
        <NavigationMenuLink asChild>
          <Link href='/'>Inicio</Link>
        </NavigationMenuLink>

        {session ? (
          <NavigationMenuLink asChild>
            <Link href='/auth/signout'>Cerrar sesión</Link>
          </NavigationMenuLink>
        ) : (
          <NavigationMenuLink asChild>
            <Link href='/auth/signin'>Iniciar sesión</Link>
          </NavigationMenuLink>
        )}
      </NavigationMenu>
    </header>
  );
}
