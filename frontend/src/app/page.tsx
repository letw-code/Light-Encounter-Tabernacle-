'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PremiumButton from '@/components/ui/PremiumButton'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import SectionWrapper from '@/components/shared/SectionWrapper'
import { Calendar, Youtube, ChevronRight, ArrowRight, Heart, Users, Shield, Sparkles, PlayCircle } from 'lucide-react'
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
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsApi.getPage('home')
        if (data && data.content && data.content.blocks && data.content.blocks.length > 0) {
          setBlocks(data.content.blocks)
        } else {
          console.log("Using default home blocks")
          setBlocks(DEFAULT_HOME_BLOCKS)
        }
      } catch (e) {
        console.log("Failed to fetch home content, using defaults", e)
        setBlocks(DEFAULT_HOME_BLOCKS)
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
    <div className="bg-white dark:bg-black overflow-x-hidden min-h-screen">
      <LiveStreamPlayer />
      <PageRenderer blocks={blocks} />
    </div>
  )
}
