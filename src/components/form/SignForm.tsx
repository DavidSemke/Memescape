import Logo from "../Logo"
import Link from "next/link"

type SignFormProps = {
    signingUp?: boolean,
}

export default function SignForm({ signingUp=false }: SignFormProps) {
    let heading = 'Sign In'
    let bottomText = "Don't have an account?"

    if (signingUp) {
        heading = 'Sign Up'
        bottomText = 'Already have an account?'
    }

    const otherSignPath = '/' + heading.toLowerCase().split(' ').join('-')

    return (
        <form 
            method="post"
            className="flex flex-col items-center gap-4 w-full"
        >
            <header className="flex justify-center gap-4">
                <Logo />
                <h1>{heading}</h1>
            </header>
            <div className="w-full">
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" />
            </div>
            <div className="w-full">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
            </div>
            <button type='submit' className="btn-primary">{heading}</button>
            <div className="flex flex-col items-center">
                <p>{bottomText}</p>
                <Link href={otherSignPath}>{heading}</Link>
            </div>
        </form>
    )
}