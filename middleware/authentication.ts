// middleware/auth.global.ts

import { useHashedCookie } from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
  // Get cookies
  const userToken = useHashedCookie<string | null | undefined>("c96434292aae604");

  // Optional: Check only protected routes
  const isPublicRoute = ["/", "/login"].includes(to.path);
  if (isPublicRoute) return;

  if (!userToken.value) {
    // Token missing, treat as unauthenticated
    return navigateTo("/", { replace: true });
  }

  try {
    const payload = JSON.parse(atob(userToken.value.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      clearAllUserCookies();
      return navigateTo("/", { replace: true });
    }
  } catch (err) {
    console.error("Invalid token", err);
    clearAllUserCookies();
    return navigateTo("/", { replace: true });
  }
});
