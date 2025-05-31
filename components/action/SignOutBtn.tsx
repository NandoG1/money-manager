"use client";

import { signOut } from "next-auth/react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

function SignOutBtn() {
  const handleSignOut = () => {
    signOut({ redirect: true });
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-md text-base font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-300 md:mx-4 md:mb-4 md:px-4 md:py-3"
      onClick={handleSignOut}
    >
      <HiArrowRightOnRectangle size={20} /> Sign Out
    </div>
  );
}

export default SignOutBtn;
