"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import UserAvatar from "../card/UserAvatar";

interface Props {
  data: {
    name: string;
    email: string;
    image?: string;
    id: string;
  };
}

function Header({ data }: Props) {
  const pathname = usePathname();
  const pageName = pathname.split("/").join(" ");

  return (
    <div className="sticky top-6 z-50 hidden w-full items-center justify-between rounded-xl border border-white/10 bg-black/70 backdrop-blur-md p-4 shadow-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>
        <h3 className="text-2xl font-bold capitalize">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{pageName}</span>
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <div className="border-l border-white/10 pl-4">
          <UserAvatar data={data} />
        </div>
      </div>
    </div>
  );
}

export default Header;
