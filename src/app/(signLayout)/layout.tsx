export default function SignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="column-view mb-12 flex border border-stress-tertiary p-4">
        {children}
      </div>
    </div>
  )
}
