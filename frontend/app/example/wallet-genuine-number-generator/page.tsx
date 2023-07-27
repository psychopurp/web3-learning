"use client";
import { usePathname } from "next/navigation";

export default function Index() {
  const pathname = usePathname();
  return <div>{pathname}</div>;
}
