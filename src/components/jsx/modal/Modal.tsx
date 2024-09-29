import { ButtonHTMLAttributes, MutableRefObject, ReactElement } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
  rootRef?: MutableRefObject<HTMLDivElement | null>
  title: string
  buttons: (
    | ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, "button">
    | ReactElement<ButtonHTMLAttributes<HTMLAnchorElement>, "a">
  )[]
  buttonContainerRef?: MutableRefObject<HTMLDivElement | null>
  children: React.ReactNode
}

/*
    Buttons can be links styled as buttons.
*/
export default function Modal({
  title,
  buttons,
  buttonContainerRef,
  children,
}: ModalProps) {
  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 animate-fadeIn bg-overlay">
      <div
        role="dialog"
        aria-label={title}
        className="column-view absolute left-1/2 top-1/2 flex h-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 overflow-hidden border-2 border-stress-tertiary bg-tertiary p-4"
      >
        <div className="column-view flex grow flex-col items-center gap-4">
          <h2>{title}</h2>
          {children}
        </div>
        <div
          ref={buttonContainerRef}
          className="absolute bottom-0 flex w-full justify-around p-4"
        >
          {buttons}
        </div>
      </div>
    </div>,
    document.body,
  )
}
