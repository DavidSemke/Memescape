import Sidebar from "@/components/navbar/Sidebar"
import Topbar from "@/components/navbar/Topbar"
import Footer from "@/components/navbar/Footer"
import { SidebarProvider } from "@/components/context/SidebarContext"
import { auth } from "@/app/api/auth/[...nextauth]/auth"

export default async function NavbarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <>
            <SidebarProvider>
                <Topbar session={session}/>
                <Sidebar session={session}/>
            </SidebarProvider>
            <div className="min-h-screen p-4">
                {children}
            </div>
            <Footer />
        </>
    )
}