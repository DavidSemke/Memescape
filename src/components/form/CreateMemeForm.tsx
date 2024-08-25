'use client'

import Searchbar from "@/components/search/Searchbar";
import { Input } from "@/components/form/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { FormStateView } from "./FormStateView"
import { FormState } from "@/data/api/types/action/types"
import { postMeme } from "@/data/api/controllers/meme";
import DeepImageGrid from "../grid/DeepImageGrid";
import { getTemplates } from "@/data/api/controllers/template";
import { useState } from "react";
import { ProcessedImage } from "@/data/api/types/model/types";


export default function CreateMemeForm() {
    const [query, setQuery] = useState<string>('')
    const [template, setTemplate] = useState<ProcessedImage | null>(null)
    const [state, action] = useFormState<FormState, FormData>(postMeme, false)
    const errors = typeof state === "object" && "errors" in state ? state.errors : null

    return (
        <form action={action}>
            <section className="flex flex-col gap-4 w-full">
                <h2>Template</h2>
                <div className="flex items-center gap-4">
                    <div className='flex items-center w-32 h-32 border-2 border-stress-secondary italic text-center'>
                        Template Appears Here
                    </div>
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
                <div>
                    <Searchbar 
                        searchItemName="template"
                        onSearch={() => {}}
                    />
                    <DeepImageGrid
                        initImages={[]}
                        fetchAction={async (query, page, pageSize) => {
                            'use server'
                            
                            const templates = await getTemplates(
                                query ?? '', page, pageSize, true
                            )

                            return templates.map(template => { 
                                if (!template.image) {
                                    throw new Error('Template lacks image data.')
                                }

                                return template.image 
                            })
                            
                        }}
                        query={query}
                        pageSize={10}
                        onImageClick={(image) => {
                            setTemplate(image)
                        }}
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