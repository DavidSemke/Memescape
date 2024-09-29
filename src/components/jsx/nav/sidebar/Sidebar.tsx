"use client"

import { UserCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import { SidebarContext } from "../../context/SidebarContext"
import { SignButton } from "../../button/SignButton"
import { useContext } from "react"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { NestedUser } from "@/data/api/types/model/types"

type SidebarProps = {
  sessionUser: NestedUser | null
}

export default function Sidebar({ sessionUser }: SidebarProps) {
  const { showSidebar } = useContext(SidebarContext)
  const pathname = usePathname()
  const profileImageSrc = sessionUser?.profile_image?.base64
  const links = {
    userProfile: sessionUser ? `/${sessionUser.name}` : undefined,
    userMemes: sessionUser ? `/memes?user-id=${sessionUser.id}` : undefined,
    findMemes: "/memes",
    createMeme: "/memes/create",
  }

  return (
    <nav
      className={clsx(
        "fixed right-0 top-[max(var(--h-topbar),var(--min-h-topbar))] z-20 flex h-full w-full flex-col items-center gap-4 bg-primary p-4 duration-300 ease-in-out sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4",
        {
          "translate-x-0": showSidebar,
          "translate-x-full": !showSidebar,
        },
      )}
    >
      <section className="flex w-full items-center gap-4 border-b-2 border-stress-secondary pb-4">
        {profileImageSrc ? (
          <Image
            src={profileImageSrc}
            width={48}
            height={48}
            alt="Your profile picture"
            className="rounded-full"
          />
        ) : (
          <UserCircleIcon
            role="img"
            aria-label="Default profile picture"
            className="h-12 w-12"
          />
        )}
        <div className="text-lg">
          {sessionUser ? sessionUser.name : "Anonymous"}
        </div>
      </section>
      {links.userProfile && links.userMemes ? (
        <section className="flex w-full flex-col gap-4 border-b-2 border-stress-secondary pb-4">
          <Link
            href={links.userProfile}
            className={clsx({
              underline: pathname === links.userProfile,
            })}
          >
            Your Profile
          </Link>
          <Link
            href={links.userMemes}
            className={clsx({
              underline: pathname === links.userMemes,
            })}
          >
            Your Memes
          </Link>
        </section>
      ) : (
        <section className="flex w-full flex-col items-center gap-4 border-b-2 border-stress-secondary pb-4">
          <p className="text-center">
            Do you want meme storage or for others to see your memes?
          </p>
          <Link href="/sign-up" className="btn-primary">
            Sign Up
          </Link>
        </section>
      )}
      <section className="flex w-full flex-col gap-4 border-b-2 border-stress-secondary pb-4">
        <Link
          href={links.findMemes}
          className={clsx({
            underline: pathname === links.findMemes,
          })}
        >
          Find Memes
        </Link>
        <Link
          href={links.createMeme}
          className={clsx({
            underline: pathname === links.createMeme,
          })}
        >
          Create Meme
        </Link>
      </section>
      {sessionUser && <SignButton type="out" />}
    </nav>
  )
}
