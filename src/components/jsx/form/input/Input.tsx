import { attrsStyleMerge } from "@/components/utils"
import clsx from "clsx"

type InputProps = {
  name: string
  label?: string
  errors?: string[]
  attrs?: {
    root?: Record<string, any>
    label?: Record<string, any>
    input?: Record<string, any>
  }
}

export default function Input({
  name,
  label,
  errors = [],
  attrs = {},
}: InputProps) {
  const hide = attrs.input?.type === "hidden"
  const asRow = ["checkbox", "radio"].includes(attrs.input?.type)
  const defaultStyles = {
    root: clsx("flex", {
      "items-center gap-4": asRow,
      "flex-col gap-2": !asRow,
      hidden: hide,
    }),
    label: "font-semibold",
    input:
      "bg-input-primary rounded-2xl border-none ring-2 ring-stress-secondary focus:ring-4 focus:ring-stress-primary",
  }
  const styles = attrsStyleMerge(attrs, defaultStyles)
  label =
    label ??
    name
      .split("-")
      .map((word) => {
        return word[0].toUpperCase() + word.slice(1)
      })
      .join(" ")

  return (
    <>
      <div {...attrs.root} className={styles.root}>
        {label && (
          <label {...attrs.label} htmlFor={name} className={styles.label}>
            {label}
          </label>
        )}
        <input
          {...attrs.input}
          id={name}
          name={name}
          className={styles.input}
        />
      </div>
      {errors.length > 0 && (
        <ul className="list-inside list-disc text-error">
          {errors.map((error) => {
            return <li key={error}>{error}</li>
          })}
        </ul>
      )}
    </>
  )
}
