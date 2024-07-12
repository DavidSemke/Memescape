import Sidebar from "@/components/navbar/Sidebar"
import Topbar from "@/components/navbar/Topbar"
import Footer from "@/components/navbar/Footer"
import { SidebarProvider } from "@/components/context/SidebarContext"

export default function NavbarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SidebarProvider>
                <Topbar />
                <Sidebar />
            </SidebarProvider>
            {children}
            <Footer />
        </>
    )
}