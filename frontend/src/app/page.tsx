'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PremiumButton from '@/components/ui/PremiumButton'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import SectionWrapper from '@/components/shared/SectionWrapper'
import Hero from '@/components/shared/Hero'
import LiveStreamPlayer from '@/components/LiveStreamPlayer'
import { Calendar, Youtube, ChevronRight, ArrowRight, Heart, Users, Shield, Sparkles, PlayCircle, Loader2 } from 'lucide-react'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Spotlight } from '@/components/ui/spotlight'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { motion } from 'framer-motion'
import { sermonApi, eventApi, cmsApi, Sermon, Event, CMSPageContent } from '@/lib/api'

const DEFAULT_CONTENT: CMSPageContent = {
  hero: {
    title: "Light Encounter Tabernacle",
    subtitle: "Engage. Empower. Uplift. Experience the divine presence in a sanctuary of faith and love.",
    bg_image: "/9.png"
  },
  about: {
    label: "About Us",
    founder_image: "/Founder.png",
    founder_name: "Apostle. Olawale N. Sanni",
    founder_role: "Founder/President",
    founder_email: "president@letw.org",
    title: "A Vision for <br />Community Transformation",
    content_1: "Founded on the principles of faith, love, and service, Light Encounter Tabernacle is dedicated to being a beacon of hope. Our mission is to empower individuals to live purposeful lives through the transformative power of God's Word.",
    content_2: `"You are the light of the world. A town built on a hill cannot be hidden... In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven." - Matthew 5:14-16`
  },
  essence: {
    label: "Our Essence",
    title: "More Than A Church",
    cards: [
      {
        title: "Divine Worship",
        description: "Experience powerful, spirit-filled worship that connects you directly to the heart of God.",
        image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
        className: "md:col-span-2",
        icon: "Sparkles"
      },
      {
        title: "Community",
        description: "A place where everyone belongs. We foster strong relationships and genuine care.",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        className: "md:col-span-1",
        icon: "Users"
      },
      {
        title: "Pastoral Care",
        description: "Guidance and support for every season of your life.",
        image: "https://images.unsplash.com/photo-1544427928-c49cdfebf494?w=800",
        className: "md:col-span-1",
        icon: "Shield"
      },
      {
        title: "Outreach",
        description: "Extending God's love beyond our walls to those in need.",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
        className: "md:col-span-2",
        icon: "Heart"
      }
    ]
  }
}

export default function HomePage() {
  const [content, setContent] = useState<CMSPageContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for effect or fetch real data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#140152]" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-black overflow-x-hidden min-h-screen">
      <LiveStreamPlayer />

      {/* Hero Section */}
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImage={content.hero.bg_image}
      />

      {/* About Section */}
      <SectionWrapper id="about" className="bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#f5bb00] rounded-[2.5rem] rotate-6 group-hover:rotate-3 transition-transform duration-500 opacity-20" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src={content.about.founder_image}
                alt={content.about.founder_name}
                className="w-full h-[600px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#140152] via-[#140152]/80 to-transparent p-8 text-white">
                <h3 className="text-2xl font-bold font-serif">{content.about.founder_name}</h3>
                <p className="text-[#f5bb00] font-medium tracking-wide">{content.about.founder_role}</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5bb00]/10 text-[#f5bb00] text-sm font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#f5bb00] animate-pulse" />
              {content.about.label}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#140152] leading-tight" dangerouslySetInnerHTML={{ __html: content.about.title }} />

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
              <p>{content.about.content_1}</p>
              <div className="pl-6 border-l-4 border-[#f5bb00] italic text-gray-800 bg-gray-50 py-4 pr-4 rounded-r-xl">
                {content.about.content_2}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <PremiumButton href="/about" variant="primary">Read Our Full Story</PremiumButton>
              <PremiumButton href="/join" variant="outline">Join Our Family</PremiumButton>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Essence Section (Bento Grid) */}
      <SectionWrapper id="essence" className="bg-gray-50">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-[#140152]">{content.essence.title}</h2>
          <p className="text-gray-500 text-lg">Discover the pillars that uphold our community and faith.</p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {content.essence.cards.map((card, i) => (
            <BentoGridItem
              key={i}
              title={card.title}
              description={card.description}
              header={
                <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              }
              className={card.className}
              icon={card.icon === 'Sparkles' ? <Sparkles className="h-4 w-4 text-[#f5bb00]" /> :
                card.icon === 'Users' ? <Users className="h-4 w-4 text-[#f5bb00]" /> :
                  card.icon === 'Shield' ? <Shield className="h-4 w-4 text-[#f5bb00]" /> :
                    <Heart className="h-4 w-4 text-[#f5bb00]" />}
            />
          ))}
        </BentoGrid>
      </SectionWrapper>

      {/* Call to Action */}
      <section className="relative py-24 bg-[#140152] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f5bb00]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Ready to Experience <br />
            <span className="text-[#f5bb00]">God's Glory?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join us this Sunday correctly or connect with us online. Your journey to spiritual fulfillment starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <PremiumButton href="/join" className="h-14 px-10 text-lg">
              Join The Family
            </PremiumButton>
            <PremiumButton href="/contact" variant="outline" className="h-14 px-10 text-lg text-white border-white/20 hover:bg-white/10">
              Plan Your Visit
            </PremiumButton>
          </div>
        </div>
      </section>

    </div>
  )
}
