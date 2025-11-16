// middleware/role.global.ts

import { useHashedCookie } from "#imports";

export default defineNuxtRouteMiddleware((to) => {
  const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

  const protectedRoutes: Record<string, string[]> = {
    "/users": ["admin"], // Only 'admin' can access /users
  };

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    to.path.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = protectedRoutes[matchedRoute];
    if (!allowedRoles.includes(userRole.value || "")) {
      return navigateTo("/unauthorized", { replace: true });
    }
  }
});
