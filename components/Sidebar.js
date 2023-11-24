import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import { HomeIcon } from "@heroicons/react/24/solid";
import { HashtagIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { InboxIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
      <div className="hoverEffect p-0 hover:bg-blue-100 pt-2 pl-1 pr-1">
        <Image
          src="/23.png"
          width={50}
          height={50}
          alt="Logo"
          onClick={() => router.push("/")}
        />
      </div>
      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenuItem name="Home" Icon={HomeIcon} active />
        <SidebarMenuItem name="Explore" Icon={HashtagIcon} />

        {session && (
          <>
            <SidebarMenuItem name="Notifications" Icon={BellIcon} />
            <SidebarMenuItem name="Messages" Icon={InboxIcon} />
            <SidebarMenuItem name="Bookmark" Icon={BookmarkIcon} />
            <SidebarMenuItem name="Lists" Icon={ClipboardIcon} />
            <SidebarMenuItem name="Profile" Icon={UserIcon} />
            <SidebarMenuItem name="More" Icon={EllipsisHorizontalCircleIcon} />
          </>
        )}
      </div>

      {session ? (
        <>
          <button className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
            Tweet
          </button>

          <div className="hoverEffect text-gray-100 flex items-center justify-center xl:justify-start mt-auto">
            <img
              onClick={signOut}
              src={session?.user.image}
              alt="Profile"
              className="h-10 w-10 rounded-full xl:mr-2"
            />
            <div className="leading-5 hidden xl:inline">
              <h4 className="font-bold">{session?.user?.name}</h4>
              <p className="text-gray-500 hover:text-black">
                @{session?.user?.username}
              </p>
            </div>
            <EllipsisHorizontalIcon className="h-4 xl:ml-8 hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          className="bg-blue-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
          onClick={signIn}
        >
          Sign In
        </button>
      )}
    </div>
  );
}

// <button
// className="bg-blue-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
// onClick={signIn}
// >
// Sign In
// </button>
