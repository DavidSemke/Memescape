import SignForm from '@/components/form/SignForm'

export default function SignInPage({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main>
            <SignForm />
        </main>
    )
}