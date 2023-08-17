"use client";
import { usePathname } from "next/navigation";

export function Component() {
  const pathname = usePathname();
  return <div>{pathname}</div>;
}
