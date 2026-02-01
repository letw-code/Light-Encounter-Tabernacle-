'use client'

import React, { useState, useEffect } from 'react'
import { cmsApi, Block } from '@/lib/api'
import PageRenderer from '@/components/cms/PageRenderer'
import { DEFAULT_IMPACT_BLOCKS } from '@/lib/cmsDefaults'
import { Loader2 } from 'lucide-react'

export default function ImpactPage() {
    const [blocks, setBlocks] = useState<Block[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await cmsApi.getPage('impact')
                if (data && data.content && data.content.blocks && data.content.blocks.length > 0) {
                    setBlocks(data.content.blocks)
                } else {
                    console.log("Using default impact blocks")
                    setBlocks(DEFAULT_IMPACT_BLOCKS)
                }
            } catch (e) {
                console.log("Failed to fetch impact content, using defaults", e)
                setBlocks(DEFAULT_IMPACT_BLOCKS)
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
                <Loader2 className="w-12 h-12 animate-spin text-[#140152]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Hero */}
            <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-[#140152] pt-24">
                <img
                    src={getImageUrl(content.hero?.bg_image)}
                    alt="Impact"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto"
                >
                    <div className="text-[#f5bb00] font-bold tracking-widest uppercase mb-2 text-sm md:text-base">{content.hero?.label}</div>
                    <h1 className="text-4xl md:text-6xl font-black mb-3 leading-tight" dangerouslySetInnerHTML={{ __html: content.hero?.title || "" }} />
                    <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
                        {content.hero?.subtitle}
                    </p>
                </motion.div>
            </div>

            {/* Impact Stats */}
            <SectionWrapper>


                <BentoGrid className="max-w-6xl mx-auto">
                    {content.grid && ['outreach', 'missions', 'youth', 'medical'].map((key) => {
                        const item = content.grid?.[key];
                        if (!item) return null;
                        return (
                            <BentoGridItem
                                key={key}
                                title={item.title}
                                description={item.description}
                                header={<div
                                    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 bg-cover bg-center opacity-80"
                                    style={{ backgroundImage: `url('${getImageUrl(item.image)}')` }}
                                />}
                                className={key === 'outreach' || key === 'medical' ? "md:col-span-2" : "md:col-span-1"}
                                icon={getIcon(item.icon || 'Heart')}
                            />
                        )
                    })}
                </BentoGrid>
            </SectionWrapper>

            <SectionWrapper background="gray">
                <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-[#140152] mb-4">{content.partner?.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {content.partner?.content}
                        </p>
                        <div className="flex gap-4">
                            <PremiumButton href={content.partner?.button_link || "/giving"}>{content.partner?.button_text}</PremiumButton>
                        </div>
                    </div>
                    <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
                        <img src={getImageUrl(content.partner?.image)} alt="Partner" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                </div>
            </SectionWrapper>
        </div>
    )
}
