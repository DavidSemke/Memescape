'use client'

import { useState } from "react";
import clsx from "clsx";

type TabbedViewProps = {
    tabs: { title: string, view: JSX.Element }[]
}

export default function TabbedView({ tabs }: TabbedViewProps) {
    const [openTab, setOpenTab] = useState<string>(tabs[0].title)
    
    return (
        <div className="w-full">
            <div className="flex w-full mb-4 border-b-2 border-stress-secondary">
                {
                    tabs.map(tab => {
                        return (
                            <button
                                key={tab.title}
                                type='button'
                                className="btn-secondary rounded-b-none"
                                onClick={() => setOpenTab(tab.title)}
                            >
                                {tab.title}
                            </button>
                        )
                    })
                }
            </div>
            {
                tabs.map(tab => {
                    return (
                        <div 
                            key={tab.title} 
                            className={clsx(
                                {
                                    'hidden': tab.title === openTab
                                }
                            )}
                        >
                            {tab.view}
                        </div>
                    )
                })
            }
        </div>
    )
}