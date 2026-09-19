'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-body overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
      </video>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-3xl tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Velorah<sup className="text-xs">®</sup>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/problems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Studio</Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="/journal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Journal</Link>
          <Link href="/reach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reach Us</Link>
        </div>
        <Link href="/dashboard" className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform">
          Begin Journey
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 py-[90px] h-[calc(100vh-88px)] min-h-[600px]">
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal animate-fade-rise"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Where <em className="not-italic text-muted-foreground">dreams</em> rise <em className="not-italic text-muted-foreground">through the silence.</em>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          We&apos;re designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
        </p>
        <Link href="/dashboard" className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] cursor-pointer transition-transform animate-fade-rise-delay-2">
          Begin Journey
        </Link>
      </section>
    </div>
  );
}
