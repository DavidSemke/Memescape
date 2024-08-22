import { attrsStyleMerge } from "../utils"

type InputProps = {
    name: string,
    errors?: string[],
    attrs?: {
        root?: Record<string, any>,
        label?: Record<string, any>,
        input?: Record<string, any>
    }
}

export function Input({ name, errors=[], attrs={} }: InputProps) {
    const defaultStyles = {
        root: 'flex flex-col gap-2',
        label: 'font-semibold',
        input: 'bg-input-primary rounded-2xl border-none ring-2 ring-stress-secondary focus:ring-4 focus:ring-stress-primary'
    }
    const styles = attrsStyleMerge(attrs, defaultStyles)
    const inputIsHidden = attrs.input?.type === 'hidden'
    let label = null

    if (!inputIsHidden) {
        label = name
            .split('-')
            .map(word => {
                return word[0].toUpperCase() + word.slice(1)
            })
            .join(' ')
    }
    

    return (
        <div {...attrs.root} className={styles.root}>
            {
                label && (
                    <label 
                        {...attrs.label} 
                        htmlFor={name} 
                        className={styles.label}
                    >
                        {label}
                    </label>
                )
            }
            
            <input
                {...attrs.input}
                id={name} 
                name={name} 
                className={styles.input}
            />
            {
                errors.length > 0 && (
                    <ul className="text-error list-disc list-inside">
                        {errors.map(error => {
                            return (
                                <li key={error}>
                                    {error}
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        </div>
    )
}