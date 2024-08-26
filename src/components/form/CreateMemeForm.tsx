'use client'

import Searchbar from "@/components/search/Searchbar";
import { Input } from "@/components/form/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { FormStateView } from "./FormStateView"
import { FormState } from "@/data/api/types/action/types"
import { postMeme } from "@/data/api/controllers/meme";
import DeepImageGrid, { DeepImageGridFetchAction } from "../grid/DeepImageGrid";
import { useState } from "react";
import { ProcessedImage } from "@/data/api/types/model/types";
import Image from "next/image"
import { getOneTemplate } from "@/data/api/controllers/template";

type CreateMemeFormProps = {
    templateGridFetchAction: DeepImageGridFetchAction,
}

export default function CreateMemeForm({
    templateGridFetchAction
}: CreateMemeFormProps) {
    const [query, setQuery] = useState<string>('')
    const [template, setTemplate] = useState<
        { 
            image: ProcessedImage,
            lines: number
        } | null
    >(null)
    const [state, action] = useFormState<FormState, FormData>(postMeme, false)
    const errors = typeof state === "object" && "errors" in state ? state.errors : null

    return (
        <form action={action}>
            <section className="flex flex-col gap-4 w-full">
                <h2>Template</h2>
                <div className="flex items-center gap-4">
                    
                    <div className='flex items-center w-32 h-32 border-2 border-stress-secondary italic text-center'>
                        {
                            template === null ? (
                                'Template Appears Here'
                            ) : (
                                <Image
                                    src={template.image.base64}
                                    width={0}
                                    height={0}
                                    alt={template.image.alt}
                                    className="w-full"
                                />
                            )
                        }
                        
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
                        onSearch={(input) => setQuery(input)}
                    />
                    <DeepImageGrid
                        initImages={[]}
                        fetchAction={templateGridFetchAction}
                        query={query}
                        pageSize={10}
                        onImageClick={async (image) => {
                            const template = await getOneTemplate(image.id)
                            setTemplate({
                                image,
                                lines: template!.lines
                            })
                        }}
                    />
                </div>
            </section>
            <section className="flex flex-col gap-4 w-full">
                <h2>Text</h2>
                {
                    template === null ? ( 
                        <p>You must select a template before you can add text.</p>
                    ) : (
                        [...Array(template.lines)].map(lineNum => {
                            const name = `line-${lineNum}`

                            return (
                                <Input 
                                    name={name}
                                    errors={errors?.[name]}
                                />
                            )
                        })
                    )
                }
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