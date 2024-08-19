import Logo from "../image/Logo"

export default function Footer() {
    return (
        <footer className='p-4 bg-primary flex flex-col items-center z-20 border-t-2 border-stress-tertiary'>
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