"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import Link from "next/link";

import UserAvatar from "../card/UserAvatar";
import SignOutBtn from "../action/SignOutBtn";

import { SidebarLinks } from "@/index";
import { HiBars3BottomLeft, HiXMark } from "react-icons/hi2";

function MobileNav() {
  const [openNav, setOpenNav] = useState(false);

  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpenNav(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="sticky top-0 z-20">
      <div className="relative flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/80 backdrop-blur-sm p-4 shadow-xl lg:hidden">
        <div>
          <div
            onClick={() => {
              setOpenNav((prev) => !prev);
            }}
          >
            {openNav ? <HiXMark size={24} /> : <HiBars3BottomLeft size={24} />}
          </div>
          <div
            className={`absolute top-[70px] flex h-[92vh] w-full flex-col bg-black/95 backdrop-blur-sm p-4 shadow-xl duration-200 border-t border-white/5 ${openNav ? "left-0" : "-left-[1000px]"}`}
          >
            <div className="flex flex-col gap-4">
              {SidebarLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.path}
                  className={`flex items-center gap-2 rounded-md p-2 text-sm font-semibold transition-all duration-300 hover:bg-white/5
                  ${pathname === link.path ? "text-main-cyan bg-main-cyan/10 shadow-lg shadow-main-cyan/5" : "text-foreground/80 hover:text-main-cyan"}`}
                  onClick={() => setOpenNav(false)}
                >
                  {link.icon} {link.title}
                </Link>
              ))}
            </div>
            <div className="mt-[400px] flex flex-col items-center justify-center gap-4">
              <UserAvatar data={session} />
              <SignOutBtn />
            </div>
          </div>
        </div>
        <Link
          href={"/"}
          className="text-center text-2xl font-bold italic text-main-cyan"
        >
          FinTrack
        </Link>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
