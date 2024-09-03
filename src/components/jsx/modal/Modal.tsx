import { ButtonHTMLAttributes, ReactElement } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
    title: string,
    buttons: (
        ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>
        | ReactElement<ButtonHTMLAttributes<HTMLAnchorElement>, 'a'>
    )[],
    children: React.ReactNode
}

/*
    Buttons can be links styled as buttons.
*/
export default function Modal({
    title,
    buttons,
    children 
}: ModalProps) {
    return createPortal(
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-overlay animate-fadeIn">
            <div className="flex flex-col items-center gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] p-4 bg-tertiary border-2 border-stress-tertiary overflow-hidden">
                <div className="grow flex flex-col items-center gap-4 w-full">
                    <h2>{title}</h2>
                    {children}
                </div>
                <div className="flex justify-around w-full">
                    {buttons}
                </div>
            </div>
        </div>,
        document.body
    )
}