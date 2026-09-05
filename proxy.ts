import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Temporary recovery endpoint must reach its own route handler unchanged.
  // The endpoint itself is protected by ADMIN_RECOVERY_TOKEN.
  if (request.nextUrl.pathname === "/api/recovery/admin-password") {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
