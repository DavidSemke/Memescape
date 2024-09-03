import { XCircleIcon } from "@heroicons/react/24/outline"

type XButtonProps = {
    label?: string
    onClick: () => void
}

export default function XButton({
    label='Cancel', onClick
}: XButtonProps) {
    return (
        <button
            type='button'
            className="btn-primary"
            onClick={onClick}
            aria-labelledby="x-button-label"
        >
            <XCircleIcon 
                className="w-6 h-6"
            />
            <div id='x-button-label'>{label}</div>
        </button>
    )
}