import { ButtonHTMLAttributes, MutableRefObject, ReactElement } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
    title: string,
    buttons: (
        ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>
        | ReactElement<ButtonHTMLAttributes<HTMLAnchorElement>, 'a'>
    )[],
    buttonContainerRef?: MutableRefObject<HTMLDivElement | null>,
    children: React.ReactNode
}

/*
    Buttons can be links styled as buttons.
*/
export default function Modal({
    title,
    buttons,
    buttonContainerRef,
    children 
}: ModalProps) {
    return createPortal(
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-overlay animate-fadeIn">
            <div className="column-view flex flex-col items-center gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] p-4 bg-tertiary border-2 border-stress-tertiary overflow-hidden">
                <div className="column-view grow flex flex-col items-center gap-4">
                    <h2>{title}</h2>
                    {children}
                </div>
                <div 
                    ref={buttonContainerRef}
                    className="flex justify-around w-full absolute bottom-0 p-4"
                >
                    {buttons}
                </div>
            </div>
        </div>,
        document.body
    )
}