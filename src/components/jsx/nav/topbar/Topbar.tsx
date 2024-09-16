"use client"

import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import Logo from "../../image/Logo"
import { SidebarContext } from "../../context/SidebarContext"
import { TopSearchbarContext } from "../../context/TopSearchbarContext"
import { SignButton } from "../../button/SignButton"
import { useContext } from "react"
import { NestedUser } from "@/data/api/types/model/types"

type TopbarProps = {
  sessionUser: NestedUser | null
}

export default function Topbar({ sessionUser }: TopbarProps) {
  const { setShowSidebar } = useContext(SidebarContext)
  const { showTopSearchbarButton, setShowTopSearchbar } =
    useContext(TopSearchbarContext)

  return (
    <nav className="sticky top-0 z-20 flex h-[--h-topbar] min-h-[--min-h-topbar] w-full justify-around border-b-2 border-stress-tertiary bg-primary p-2">
      <Logo
        title={true}
        attrs={{
          title: {
            className: "hidden sm:block",
          },
        }}
      />
      <div className="flex items-center gap-4">
        {showTopSearchbarButton && (
          <button
            type="button"
            aria-label="Search memes"
            className="btn-secondary animate-bounce px-3"
            onClick={() => setShowTopSearchbar((bool) => !bool)}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        )}
        {sessionUser === null && <SignButton type="in" />}
        <button
          type="button"
          className="btn-secondary"
          aria-label="Open sidebar"
          onClick={() => {
            setShowSidebar((val) => !val)
          }}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </nav>
  )
}
