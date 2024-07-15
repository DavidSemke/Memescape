import Logo from "../Logo"

export default function Footer() {
    return (
        <footer className='p-2 bg-primary flex flex-col items-center'>
            <Logo
                title={true}
                slogan={true}
                attrs={{
                    slogan: {
                        className: 'hidden sm:block'
                    }
                }}
            />
            <div className='border-t-2 border-stress-secondary pt-2 mt-2 w-full text-center text-xs'>
                © 2024 Memescape. All rights reserved.
            </div>
        </footer>
    )
}