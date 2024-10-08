import { CheckCircleIcon } from "@heroicons/react/24/outline"

type CheckButtonProps = {
  label?: string
  onClick: () => void
}

export default function CheckButton({
  label = "Confirm",
  onClick,
}: CheckButtonProps) {
  return (
    <button
      type="button"
      className="btn-primary"
      onClick={onClick}
      aria-labelledby="check-button-label"
    >
      <CheckCircleIcon className="h-6 w-6" />
      <div id="check-button-label">{label}</div>
    </button>
  )
}
