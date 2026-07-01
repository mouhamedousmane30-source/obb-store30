import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getMe, isStaff } from "@/lib/api/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    try {
      const res = await getMe();
      if (!isStaff(res.user)) {
        throw redirect({ to: "/login" });
      }
      return { user: res.user };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
