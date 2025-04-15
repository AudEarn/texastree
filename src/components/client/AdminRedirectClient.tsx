"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRedirectClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdminRoute = pathname.startsWith("/admin");

      if (
        isAdminRoute &&
        !window.location.hostname.includes(
          "preview--treehub-automation.lovable.app"
        ) &&
        !window.location.hostname.includes("localhost") &&
        !window.location.hostname.includes("lovableproject.com")
      ) {
        // window.location.href = `https://preview--treehub-automation.lovable.app${pathname}`;
        router.push(pathname)
      }
    }
  }, [pathname]);

  return children;
}
