"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import examples from "@/examples.json";
import { Icon } from "@/components/Icon";
import { Profile } from "@/components/Profile";
import Vivus from "vivus";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { VscGithubAlt } from "react-icons/vsc";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import gradient from "random-gradient";

function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState<boolean | null>(null); // 只有移动端才会用到

  const [useWalletSet, setUseWalletSet] = useState<Set<string>>(() => {
    const filtered = examples.filter((item) => item.useWallet);
    return new Set(filtered.map((item) => item.url));
  });

  useEffect(() => {
    setMenuVisible(null);
  }, [pathname]);

  useLayoutEffect(() => {
    new Vivus("menu-icon", {
      duration: 80,
      type: "delayed",
      start: "autostart",
      dashGap: 40,
      forceRender: false,
      pathTimingFunction: Vivus.EASE_OUT,
      animTimingFunction: Vivus.EASE_OUT,
    });
  }, [menuVisible, setMenuVisible]);

  const bgGradient = gradient(String(Date.now()));

  return (
    <div className="flex h-screen">
      <nav
        className={`hidden w-0 p-0 md:p-4 md:w-[300px] md:flex md:flex-col md:justify-between ${
          menuVisible === true
            ? "!block !w-full fixed z-10 bg-white top-20"
            : menuVisible === false
            ? "!hidden !w-0"
            : ""
        }`}
      >
        <ul className="flex flex-col gap-2 py-2 md:gap-6">
          {examples.map(({ name, description, url, technologyStack, icon }) => (
            <Link key={name} href={url}>
              <li
                className={`p-2 rounded-md hover:bg-gray-100 hover:text-black flex items-center gap-2 ${
                  pathname === url
                    ? "bg-gray-200 font-medium shadow-md"
                    : "text-gray-500"
                }`}
                onMouseEnter={() => {
                  new Vivus(icon, {
                    duration: 80,
                    type: "sync",
                    start: "autostart",
                    dashGap: 20,
                    forceRender: false,
                    pathTimingFunction: Vivus.EASE_OUT,
                    animTimingFunction: Vivus.EASE_OUT,
                  });
                }}
              >
                <Icon
                  id={icon}
                  size={24}
                  min={24}
                  name={icon}
                  color={pathname === url ? "black" : "inherit"}
                />
                <span className="flex-1">{name}</span>
              </li>
            </Link>
          ))}
        </ul>

        <Link
          href="https://github.com/psychopurp/web3-learning"
          target={"_blank"}
        >
          <div className="relative hidden p-4 text-black transition duration-500 ease-in-out rounded-md md:block">
            <div className="relative z-10 flex items-center justify-between">
              <VscGithubAlt size={24} />
              <span>Github</span>
            </div>
            <div
              style={{
                background: bgGradient,
              }}
              className="absolute inset-0 rounded-md"
            ></div>
          </div>
        </Link>
      </nav>

      <div className="flex-1 min-h-full max-h-full bg-gray-100 shadow-lg md:rounded-l-[4rem] overflow-auto">
        <header className="flex justify-between items-center p-4 border-b bg-slate-50 md:rounded-tl-[4rem] sticky top-0 z-20  ">
          <div className="md:invisible">
            {menuVisible === true ? (
              <HiOutlineX
                id="menu-icon"
                size={32}
                onClick={() => setMenuVisible(!menuVisible)}
              ></HiOutlineX>
            ) : (
              <HiOutlineMenu
                id="menu-icon"
                size={32}
                onClick={() => setMenuVisible(!!!menuVisible)}
              ></HiOutlineMenu>
            )}
          </div>
          {useWalletSet.has(pathname) ? <Profile /> : <div />}
        </header>
        <div className="flex-1 p-4 ">{children}</div>
      </div>
    </div>
  );
}

export { Layout };
