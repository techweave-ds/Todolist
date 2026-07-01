import Link from 'next/link'
import { Rocket, Eye, Sparkles } from 'lucide-react'
import { ParticleBackground } from '@/components/landing/particle-background'
import { CustomCursor } from '@/components/landing/cursor'
import { HeroSection } from '@/components/landing/hero'
import { FeaturesBento } from '@/components/landing/features-bento'
import { SciFiShowcase } from '@/components/landing/sci-fi-showcase'
import { Manifesto } from '@/components/landing/manifesto'
import { FAQSection } from '@/components/landing/faq'
import { Testimonials } from '@/components/landing/testimonials'
import { FinalCTA } from '@/components/landing/final-cta'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <ParticleBackground />

      <header className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Quiet Panda</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Get Started
          </Link>
          <Link
            href="/demo"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Tour the App
          </Link>
        </nav>
      </header>

      <main>
        <HeroSection />
        <FeaturesBento />
        <SciFiShowcase />
        <Manifesto />
        <Testimonials />
        <FAQSection />
        <FinalCTA />

        <footer className="relative z-10 py-8 text-center border-t border-white/[0.04]">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Three.js, and AI. Quiet Panda &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  )
}
