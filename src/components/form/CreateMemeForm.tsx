'use client'

import Searchbar from "@/components/search/Searchbar";
import { Input } from "@/components/form/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { FormStateView } from "./FormStateView"
import { FormState } from "@/data/api/types/action/types"
import { postMeme } from "@/data/api/controllers/meme";
import DeepMemeGrid from "../grid/DeepMemeGrid";


export default function CreateMemeForm() {
    const [state, action] = useFormState<FormState, FormData>(postMeme, false)
    const errors = typeof state === "object" && "errors" in state ? state.errors : null

    return (
        <form action={action}>
            <section className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-4">
                    <h2>Template</h2>
                    <button 
                        type='button' 
                        className="btn-secondary"
                        aria-label="Search for a template."
                    >
                        <MagnifyingGlassIcon 
                            className="w-6 h-6"
                        />
                    </button>
                </div>
                <div className="flex justify-center gap-4">
                    <div className='flex items-center w-32 h-32 border-2 border-stress-secondary italic text-center'>
                        Template Appears Here
                    </div>
                    <div>
                        File upload area
                    </div>
                </div>
                <div>
                    <Searchbar 
                        searchItemName="template"
                        onSearch={() => {}}
                    />
                    <DeepMemeGrid 
                    
                    />
                </div>
            </section>
            <section className="flex flex-col gap-4 w-full">
                <h2>Text</h2>
                <Input 
                    name='top'
                    errors={errors?.top}
                />
                <Input 
                    name='bottom'
                    errors={errors?.bottom}
                />
            </section>
            <section className="w-full">
                <h2>Metadata</h2>
                <Input 
                    name="private"
                    errors={errors?.private}
                    attrs={{
                        input: {
                            type: 'checkbox',
                            value: 'private'
                        }
                    }}
                />
            </section>
            <button type='submit' className="btn-primary">Preview</button>
            <FormStateView state={state}/>
        </form>
    )
}