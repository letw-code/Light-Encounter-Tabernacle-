'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SectionWrapper from '@/components/shared/SectionWrapper'
import Hero from '@/components/shared/Hero'
import PremiumButton from '@/components/ui/PremiumButton'
import { BookOpen, Cross, Flame, Heart, Sun } from 'lucide-react'

export default function BibleStudyPage() {
    const themes = [
        {
            id: 1,
            title: "The Cost of Discipleship",
            scripture: "Luke 14:27–35",
            description: "A call to wholehearted commitment—embracing sacrifice, obedience, and unwavering devotion to Christ, regardless of the cost.",
            icon: <Cross className="w-8 h-8 text-[#f5bb00]" />
        },
        {
            id: 2,
            title: "Experiencing Transformative Power Through Fruitfulness",
            scripture: "John 15:16",
            description: "Understanding divine selection and purpose, and walking in a life that produces lasting spiritual fruit through abiding in Christ.",
            icon: <Heart className="w-8 h-8 text-[#f5bb00]" />
        },
        {
            id: 3,
            title: "The Sustaining Power of the Holy Spirit",
            scripture: "Acts 1:8; Hebrews 12:22–24",
            description: "Living daily by the enabling strength of the Holy Spirit—empowered for witness, endurance, and victorious Christian living.",
            icon: <Flame className="w-8 h-8 text-[#f5bb00]" />
        },
        {
            id: 4,
            title: "Enter into His Rest Through Faith",
            scripture: "Hebrews 11:24–26",
            description: "Choosing faith over fear and eternal reward over temporary pleasure, as believers rest in God’s promises and purposes.",
            icon: <Sun className="w-8 h-8 text-[#f5bb00]" />
        }
    ]

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <Hero
                title="Bible Study"
                subtitle="Deepening our knowledge of God's Word together."
                height="medium"
                backgroundImage="/TheologyHero.jpg"
            />

            <SectionWrapper>
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#f5bb00] font-bold uppercase tracking-[0.2em] text-sm">2026 Curriculum</span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#140152]">Quarterly Themes</h2>
                    <div className="w-24 h-1.5 bg-[#f5bb00] mx-auto rounded-full" />
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mt-4">
                        This year, we embark on a journey of deeper discipleship, spiritual empowerment, and fruitful living.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {themes.map((theme) => (
                        <motion.div
                            key={theme.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: theme.id * 0.1 }}
                        >
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <CardHeader className="space-y-4">
                                    <div className="w-14 h-14 bg-[#140152]/5 rounded-xl flex items-center justify-center group-hover:bg-[#140152] transition-colors duration-300">
                                        {theme.icon}
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-[#f5bb00] uppercase tracking-wider">Quarter {theme.id}</span>
                                        <CardTitle className="text-2xl font-bold text-[#140152] mt-2 group-hover:text-[#f5bb00] transition-colors">
                                            {theme.title}
                                        </CardTitle>
                                        <p className="text-sm font-semibold text-gray-500 mt-1">{theme.scripture}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 leading-relaxed">
                                        {theme.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('/TheologyHero.jpg')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#140152] via-[#140152]/40 to-transparent opacity-90" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">Weekly Study Materials</h3>
                            <p className="text-gray-200">Access downloadable guides, prayer points, and reflection questions to deepen your understanding each week.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <span className="text-[#f5bb00] font-bold uppercase tracking-[0.2em] text-sm">Grow Deeper</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#140152]">Resources for Your Journey</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Our Bible study curriculum is designed to be more than just knowledge—it's about transformation.
                            Gain access to exclusive resources including:
                        </p>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-[#f5bb00]" />
                                <span>Detailed exposition of weekly texts</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Heart className="w-5 h-5 text-[#f5bb00]" />
                                <span>Personal reflection and application guides</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Flame className="w-5 h-5 text-[#f5bb00]" />
                                <span>Community discussion prompts</span>
                            </li>
                        </ul>
                        <PremiumButton href="/auth/login">Access Resources</PremiumButton>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#140152] rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <BookOpen className="w-full h-full text-white" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
                        <div>
                            <span className="text-[#f5bb00] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Join The Community</span>
                            <h3 className="text-3xl md:text-5xl font-black mb-6">Ready to Dive Deeper?</h3>
                            <p className="text-lg md:text-xl leading-relaxed text-gray-200 mb-2">
                                Connect with fellow believers, track your progress, and unlock exclusive study content.
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-semibold italic">
                                "The 2026 Quarterly Themes call believers into deeper discipleship."
                            </p>
                        </div>
                        <PremiumButton href="/auth/login">Login / Sign Up Now</PremiumButton>
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    )
}
