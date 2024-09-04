'use client'

import { ReactElement, useState } from "react";
import clsx from "clsx";

type TabbedViewProps = {
    tabs: { label: string, view: ReactElement }[]
}

export default function TabbedView({ tabs }: TabbedViewProps) {
    const [openTab, setOpenTab] = useState<string>(tabs[0].label)
    
    return (
        <div className="w-full">
            <div className="flex w-full mb-4 border-b-2 border-stress-secondary">
                {
                    tabs.map(tab => {
                        return (
                            <button
                                key={tab.label}
                                type='button'
                                className={clsx(
                                    "btn-secondary rounded-b-none",
                                    {
                                        'font-semibold': tab.label === openTab
                                    }
                                )}
                                onClick={() => setOpenTab(tab.label)}
                            >
                                {tab.label}
                            </button>
                        )
                    })
                }
            </div>
            {
                tabs.map(tab => {
                    return (
                        <div 
                            key={tab.label} 
                            className={clsx(
                                {
                                    'hidden': tab.label !== openTab
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