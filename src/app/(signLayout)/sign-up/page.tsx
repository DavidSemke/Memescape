import SignForm from '@/components/form/SignForm'

export default function SignUpPage({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main>
            <SignForm 
                signingUp={true}
            />
        </main>
    )
}