"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarLinks } from "../..";

import SignOutBtn from "../action/SignOutBtn";

function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed hidden h-screen w-[200px] lg:flex xl:w-[250px] flex-col border-r border-white/10 bg-black/80 backdrop-blur-md shadow-xl">
     
      <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none"></div>
      
      <div className="flex-shrink-0 p-4 relative z-10">
        <Link
          href={"/"}
          className="p-3 text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 flex items-center justify-center gap-2"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white">
            F
          </div>
          <span>FinTrack</span>
        </Link>
      </div>
      
      <div className="flex-grow overflow-y-auto no-scrollbar relative z-10">
        <div className="px-4 space-y-6 mb-4">
          {Array.from(new Set(SidebarLinks.map(link => link.section))).map((section) => (
            <div key={section} className="space-y-2">
              <div className="px-3 py-2">
                <h5 className="text-xs font-semibold uppercase text-emerald-500/80 tracking-wider">
                  {section}
                </h5>
              </div>
              <div className="flex flex-col gap-2 px-2">
                {SidebarLinks.filter(link => link.section === section).map((link) => (
                  <Link
                    key={link.title}
                    href={link.path}
                    className={`flex items-center gap-3 rounded-lg p-2.5 text-sm font-medium transition-all duration-300 group
                    ${pathname === link.path 
                      ? "text-white bg-gradient-to-r from-emerald-600/20 to-teal-600/20 shadow-md border-l-2 border-l-emerald-500" 
                      : "text-white/70 hover:text-white hover:bg-white/5"}`}
                  >
                    <span className={`${pathname === link.path ? "text-emerald-400" : "text-white/60 group-hover:text-emerald-400"} transition-colors duration-300`}>
                      {link.icon}
                    </span> 
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-shrink-0 sticky bottom-0 bg-black/80 backdrop-blur-sm border-t border-white/10 p-4 z-10">
        <SignOutBtn />
      </div>
    </nav>
  );
}

export default Sidebar;

