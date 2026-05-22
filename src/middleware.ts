// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", "/contact", "/menu", "/about", "/sign-in", "/sign-up", "/verify-email", "/cart",
  "/success", "/failure",
  "/api/webhook",
  "/api/create-user",
]);

export default clerkMiddleware(async (authFn, req) => {
  const { userId } = await authFn();

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|api/webhook).*)"
  ],
};