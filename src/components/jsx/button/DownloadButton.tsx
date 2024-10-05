import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

type DownloadButtonProps = {
  label?: string
  href: string
  downloadName: string
  onClick: () => void
}

export default function DownloadButton({
  label = "Download",
  href,
  downloadName,
  onClick,
}: DownloadButtonProps) {
  return (
    <a
      key="download"
      href={href}
      download={downloadName}
      className="btn-primary"
      aria-labelledby="download-button-label"
      onClick={onClick}
    >
      <ArrowDownTrayIcon className="h-6 w-6" />
      <div id="download-button-label">{label}</div>
    </a>
  )
}
