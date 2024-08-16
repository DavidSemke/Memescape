import Sidebar from "@/components/navbar/Sidebar"
import Topbar from "@/components/navbar/Topbar"
import Footer from "@/components/navbar/Footer"
import { SidebarProvider } from "@/components/context/SidebarContext"
import { TopSearchbarProvider } from "@/components/context/TopSearchbarContext"
import { auth } from "@/app/api/auth/[...nextauth]/auth"

export default async function NavbarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <>  
            <TopSearchbarProvider>
                <SidebarProvider>
                    <Topbar session={session}/>
                    <Sidebar session={session}/>
                </SidebarProvider>
                <div className="flex flex-col min-h-[calc(100vh-max(var(--h-topbar),var(--min-h-topbar)))] p-4">
                    {children}
                </div>
            </TopSearchbarProvider>
            <Footer />
        </>
    )
}