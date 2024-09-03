'use client'

import { 
    ButtonHTMLAttributes, 
    ReactElement, 
    useRef
} from "react"
import useContainerHeight from "@/components/hooks/useContainerHeight"
import Modal from "./Modal"
import clsx from "clsx"

type ScrollModalProps = {
    title: string,
    buttons: (
        ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>
        | ReactElement<ButtonHTMLAttributes<HTMLAnchorElement>, 'a'>
    )[],
    prefixedChildren: React.ReactNode,
    children: React.ReactNode
}

/*
    Prefixed children are children that come before the scrollable view.
    Children are placed in scrollable view.
*/
export function ScrollModal({
    title, buttons, prefixedChildren, children
}: ScrollModalProps) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const scrollContainerHeight = useContainerHeight(scrollContainerRef)

    return (
        <Modal
            title={title}
            buttons={buttons}
        >
            {prefixedChildren}
            <div
                ref={scrollContainerRef}
                className={clsx(
                    'w-full overflow-auto',
                    {
                        'grow': scrollContainerHeight === null
                    }
                )}
                style={{
                    height: scrollContainerHeight !== null ? (
                        `${scrollContainerHeight}px`
                    ) : 'auto'
                }}
            >
                {children}
            </div>
        </Modal>
    )
} 