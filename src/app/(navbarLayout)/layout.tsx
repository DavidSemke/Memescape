import Sidebar from "@/components/jsx/navbar/Sidebar"
import Topbar from "@/components/jsx/navbar/Topbar"
import Footer from "@/components/jsx/navbar/Footer"
import { SidebarProvider } from "@/components/jsx/context/SidebarContext"
import { TopSearchbarProvider } from "@/components/jsx/context/TopSearchbarContext"
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import { getOneUser } from "@/data/api/controllers/user"

export default async function NavbarLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const sessionUser = session?.user
    let fullSessionUser = null

    if (sessionUser) {
        fullSessionUser = await getOneUser(
            sessionUser.id,
            undefined,
            true
        )
    }

    return (
        <>  
            <TopSearchbarProvider>
                <SidebarProvider>
                    <Topbar sessionUser={fullSessionUser}/>
                    <Sidebar sessionUser={fullSessionUser}/>
                </SidebarProvider>
                <div className="column-view flex flex-col min-h-[calc(100vh-max(var(--h-topbar),var(--min-h-topbar)))] p-4">
                    {children}
                </div>
            </TopSearchbarProvider>
            <Footer />
        </>
    )
}