'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PremiumButtonProps {
    href?: string
    children: React.ReactNode
    onClick?: () => void
    className?: string
    target?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    variant?: "primary" | "secondary" | "outline" | "ghost" | "light" | "link"
}

export default function PremiumButton({ href, children, onClick, className, target, disabled, type, loading, variant = "primary" }: PremiumButtonProps) {
    const content = (
        <>
            <p>{loading ? 'Please wait...' : children}</p>
            <div className={cn(
                "p-2 bg-white fill-current rounded-full transition-transform group-hover:translate-x-1",
                loading && "translate-x-0",
                variant === "outline" || variant === "ghost" ? "bg-transparent text-current" : ""
            )}>
                {loading ? (
                    <Loader2 className="w-4 h-4 text-inherit animate-spin" />
                ) : (
                    <ArrowRight className="w-4 h-4 text-inherit -rotate-45" />
                )}
            </div>
        </>
    )

    const buttonClass = cn(
        "rounded-full py-0.5 px-1 pl-5 shadow-[0_0_20px_rgba(245,187,0,0.5)] hover:shadow-[0_0_30px_rgba(245,187,0,0.6)] transition-shadow duration-300",
        variant === "outline" && "shadow-none hover:shadow-lg border-2",
        className
    )

    if (href && !loading) {
        return (
            <Button variant={variant} asChild className={buttonClass} disabled={disabled}>
                <Link href={href} target={target}>
                    {content}
                </Link>
            </Button>
        )
    }

    return (
        <Button variant={variant} className={buttonClass} onClick={onClick} disabled={disabled || loading} type={type}>
            {content}
        </Button>
    )
}
