import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Establecer header con la ruta actual para que el layout pueda verificarla
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Permitir acceso a rutas de autenticación y API
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    return response;
  }

  // La verificación de sesión se hace en el layout
  // ya que better-auth requiere Node.js runtime y el middleware usa Edge Runtime
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
