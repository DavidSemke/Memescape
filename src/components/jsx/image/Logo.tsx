import Image from "next/image"
import Link from "next/link"
import { attrsStyleMerge } from "@/components/utils"

type LogoProps = {
  title?: boolean
  slogan?: boolean
  attrs?: {
    root?: Record<string, any>
    title?: Record<string, any>
    slogan?: Record<string, any>
  }
}

export default function Logo({
  title = false,
  slogan = false,
  attrs = {},
}: LogoProps) {
  const defaultStyles = {
    root: "flex items-center gap-2",
    title: "text-lg",
    slogan: "text-sm",
  }
  const styles = attrsStyleMerge(attrs, defaultStyles)

  return (
    <div {...attrs.root} className={styles.root}>
      <Link href="/">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          alt="Memescape home."
          className="rounded-full"
        />
      </Link>
      {(title || slogan) && (
        <div className="flex flex-col justify-center">
          {title && (
            <div {...attrs.title} className={styles.title}>
              Memescape
            </div>
          )}
          {slogan && (
            <p {...attrs.slogan} className={styles.slogan}>
              Find memes, create memes, share memes.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
