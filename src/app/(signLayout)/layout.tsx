export default function SignLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <div className="column-view flex mb-12 p-4 border border-stress-tertiary">
                {children}
            </div>
        </div>
    )
}