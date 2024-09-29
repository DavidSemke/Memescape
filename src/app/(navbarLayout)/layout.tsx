import Sidebar from "@/components/jsx/nav/sidebar/Sidebar"
import Topbar from "@/components/jsx/nav/topbar/Topbar"
import Footer from "@/components/jsx/nav/footer/Footer"
import { SidebarProvider } from "@/components/jsx/context/SidebarContext"
import { TopSearchbarProvider } from "@/components/jsx/context/TopSearchbarContext"
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import { getOneUser } from "@/data/api/controllers/user"

export default async function NavbarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const sessionUser = session?.user
  let fullSessionUser = null

  if (sessionUser) {
    fullSessionUser = await getOneUser(sessionUser.id, undefined, true)
  }

  return (
    <>
      <TopSearchbarProvider>
        <SidebarProvider>
          <Topbar sessionUser={fullSessionUser} />
          <Sidebar sessionUser={fullSessionUser} />
        </SidebarProvider>
        <div className="column-view min-h-screen-ex-topbar flex flex-col p-4">
          {children}
        </div>
      </TopSearchbarProvider>
      <Footer />
    </>
  )
}
