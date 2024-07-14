import SignForm from '@/components/form/SignForm'

export default function SignUpPage() {
    return (
        <main>
            <SignForm 
                signingUp={true}
            />
        </main>
    )
}