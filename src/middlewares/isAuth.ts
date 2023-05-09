import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import Cookies from "js-cookie";
import { auth } from "@/firebase";

export default function authState(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const allowsGuest = to.matched.some((record) => record.meta.auth === "guest");

  const loggedInUser = Cookies.get("loggedInUser");
  if (allowsGuest || loggedInUser) {
    next();
  } else {
    next("/login");
  }
  auth.onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
      Cookies.set("loggedInUser", JSON.stringify(user));
    } else {
      Cookies.remove("loggedInUser");
    }
  });
}
