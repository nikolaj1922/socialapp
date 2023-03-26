import React from "react";
import Image from "next/image";
import SidebarLink from "./SidebarLink";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { ExtendedUserType } from "@/types/types";
import Link from "next/link";

const Sidebar = () => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Link href="/">
          <Image src="/public/twitterLogo.jpg" alt="Logo" width={30} />
        </Link>
      </div>
      <div className="space-y-1 mt-4 mb-2.5 xl:ml-24">
        <Link href="/">
          <SidebarLink text="Home" Icon={HomeIcon} active />
        </Link>
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-[#1d9bf0] rounded-full text-white w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Tweet
      </button>
      <div
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto space-x-5"
        onClick={handleSignOut}
      >
        <div className="flex space-x-2">
          <img
            src={session?.user?.image as string}
            alt="Profile pic"
            className="h-10 w-10 rounded-full"
          />
          <div className="hidden xl:inline leading-5">
            <h4 className="font-bold">{session?.user?.name}</h4>
            <p className="text-[#6e767d]">
              @{(session?.user as ExtendedUserType)?.tag}
            </p>
          </div>
        </div>
        <DotsHorizontalIcon className="hidden xl:inline ml-10 h-5" />
      </div>
    </div>
  );
};

export default Sidebar;
