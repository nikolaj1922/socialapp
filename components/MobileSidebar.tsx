import React from "react";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  InboxIcon,
  BellIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { signOut } from "next-auth/react";

const MobileSidebar = () => {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="fixed bottom-0 bg-black h-16 w-full flex items-center justify-between px-6 border-t border-l border-r border-gray-700">
      <div className="hoverAnimation h-14 w-14 flex justify-center items-center">
        <HashtagIcon className="h-8 text-white" />
      </div>
      <div className="hoverAnimation h-14 w-14 flex justify-center items-center">
        <InboxIcon className="h-8 text-white" />
      </div>
      <Link href="/">
        <HomeIcon className="h-8 text-white" />
      </Link>
      <div className="hoverAnimation h-14 w-14 flex justify-center items-center">
        <BellIcon className="h-8 text-white" />
      </div>
      <div
        className="hoverAnimation h-14 w-14 flex justify-center items-center"
        onClick={handleSignOut}
      >
        <LogoutIcon className="h-8 text-white" />
      </div>
    </div>
  );
};

export default MobileSidebar;
