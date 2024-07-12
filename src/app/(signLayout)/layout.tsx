export default function SignLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full">
            <div className="flex flex-col items-center h-1/2 w-1/2 sm:w-full mb-12 p-12 border border-stress-secondary">
                {children}
            </div>
        </div>
    )
}