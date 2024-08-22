import Sidebar from "@/components/navbar/Sidebar"
import Topbar from "@/components/navbar/Topbar"
import Footer from "@/components/navbar/Footer"
import { SidebarProvider } from "@/components/context/SidebarContext"
import { TopSearchbarProvider } from "@/components/context/TopSearchbarContext"
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
                <div className="flex flex-col min-h-[calc(100vh-max(var(--h-topbar),var(--min-h-topbar)))] p-4">
                    {children}
                </div>
            </TopSearchbarProvider>
            <Footer />
        </>
    )
}