'use client'

import { useState } from "react";
import clsx from "clsx";

type TabbedMemeGridProps = {
    tabs: { title: string, grid: JSX.Element }[],
    limit?: number,
    userId?: string | undefined
}

/*
    Shows up to one page's worth of memes in a grid for each tab initially.
*/
export default function TabbedMemeGrid({ tabs }: TabbedMemeGridProps) {
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
                            {tab.grid}
                        </div>
                    )
                })
            }
        </div>
    )
}