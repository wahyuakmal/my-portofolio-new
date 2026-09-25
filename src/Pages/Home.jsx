import React, { useState, useEffect, useCallback, memo } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, ArrowRight } from "lucide-react"
import SpotifyCard from "../components/ui/spotify-card"

/* ── Constants ── */
const TYPING_SPEED   = 100
const ERASING_SPEED  = 50
const PAUSE_DURATION = 2000
const WORDS = ["Management Student  Finance & Investment Enthusiast"]

const SOCIAL_LINKS = [
  { icon: Github,    link: "https://github.com/wahyusyahputraakmal-project",                                                                                       label: "GitHub" },
  { icon: Linkedin,  link: "https://www.linkedin.com/in/wahyu-syahputra-akmal-484021315?utm_source=share_via&utm_content=profile",                          label: "LinkedIn" },
  { icon: Instagram, link: "https://www.instagram.com/wahyusyahputraakmal",                                                                                     label: "Instagram" },
]

/* ── Sub-components ── */

const HeroTitle = memo(() => (
  <div className="space-y-1" data-aos="fade-up" data-aos-delay="400">
    <div
      className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight grad-vi"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Turning Ideas
    </div>
    <div
      className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight text-white"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Into Reality
    </div>
  </div>
))

/**
 * TypeWriter is isolated into its own component.
 * This way its rapid state updates (every 50-100ms) only re-render THIS
 * small component, not the entire Home page with Globe + Spotify card.
 */
const TypeWriter = memo(() => {
  const [text, setText]         = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex])
        setCharIndex(prev => prev + 1)
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION)
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1))
        setCharIndex(prev => prev - 1)
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length)
        setIsTyping(true)
      }
    }
  }, [charIndex, isTyping, wordIndex])

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED)
    return () => clearTimeout(timeout)
  }, [handleTyping])

  return (
    <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="600">
      <span className="text-lg md:text-xl text-blue-200 font-light tracking-wide">
        {text}
      </span>
      <span className="w-[2px] h-5 ml-1 rounded-full"
        style={{ background: "linear-gradient(to bottom, #2563eb, #06b6d4)", animation: "blink 1s step-end infinite" }} />
    </div>
  )
})

const CTAButton = memo(({ href, text, icon: Icon, variant = "primary" }) => {
  const isPrimary = variant === "primary"
  return (
    <a href={href}>
      <button className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
        ${isPrimary
          ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.03]"
          : "border border-[rgba(255,255,255,0.12)] text-blue-100 hover:border-[rgba(59,130,246,0.5)] hover:bg-[rgba(59,130,246,0.08)] hover:scale-[1.03]"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span>{text}</span>
        <Icon className={`w-4 h-4 transition-transform duration-300 ${isPrimary ? "group-hover:translate-x-0.5" : "group-hover:rotate-45"}`} />
      </button>
    </a>
  )
})

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <button
      className="group p-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(37,99,235,0.4)] hover:bg-[rgba(37,99,235,0.1)] transition-all duration-300"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
    </button>
  </a>
))

/* ── Main Component ── */
const Home = () => {
  return (
    <>
      <Helmet>
        <title>wahyu s | Portofolio</title>
        <meta name="description" content="Website resmi Wahyu Syahputra Akmal. Aku berfokus pada pengembangan teknologi yang tidak hanya fungsional, tetapi juga menghadirkan pengalaman digital yang menarik dan berdampak." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wahyusyahputraakmal-portofolio.vercel.app" />
        <meta property="og:title"       content="Wahyu Syahputra Akmal | Portofolio" />
        <meta property="og:description" content="Website resmi dan portofolio Wahyu Syahputra Akmal." />
        <meta property="og:url"         content="https://wahyusyahputraakmal-portofolio.vercel.app" />
        <meta property="og:type"        content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Wahyu Syahputra Akmal",
            "jobTitle": "Investment & Portfolio Analyst",
            "url": "https://wahyusyahputraakmal-portofolio.vercel.app",
            "sameAs": [
              "https://github.com/wahyusyahputraakmal-project",
              "https://www.linkedin.com/in/wahyu-syahputra-akmal-484021315",
              "https://www.instagram.com/wahyusyahputraakmal"
            ]
          }
        `}</script>
      </Helmet>

      <div
        className="min-h-screen overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] relative"
        id="Home"
      >
        <div className="relative z-10">
          <div className="container mx-auto min-h-screen flex items-center justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen pt-28 pb-12 lg:pt-24 lg:pb-0 gap-8 lg:gap-16 md:justify-between w-full">

              {/* ─── Left Column ─── */}
              <div className="w-full lg:w-1/2 space-y-7 text-left order-1">
                <HeroTitle />
                {/* TypeWriter is isolated so only it re-renders, not the whole page */}
                <TypeWriter />

                {/* Description */}
                <p
                  className="text-base md:text-lg max-w-xl leading-relaxed font-light"
                  style={{ color: "var(--col-muted)" }}
                  data-aos="fade-up" data-aos-delay="700"
                >
                  Financial market trader with a Management background. 
                  Focused on technical and fundamental analysis, disciplined risk management, 
                  and structured trading execution across global markets.
                </p>

                {/* CTA Row */}
                <div
                  className="flex flex-wrap gap-3"
                  data-aos="fade-up" data-aos-delay="900"
                >
                  <CTAButton href="#Portofolio" text="Project"  icon={ExternalLink} variant="primary" />
                  <CTAButton href="#Contact"    text="Contact Me"    icon={ArrowRight}   variant="secondary" />
                </div>

                {/* Social Links */}
                <div
                  className="hidden sm:flex items-center gap-3 pt-1"
                  data-aos="fade-up" data-aos-delay="1100"
                >
                  <span className="text-xs text-blue-400 tracking-widest uppercase mr-1">Find me</span>
                  {SOCIAL_LINKS.map((s, i) => (
                    <SocialLink key={i} {...s} />
                  ))}
                </div>
              </div>

              {/* ─── Right Column — Spotify player ─── */}
              <div
                className="w-full lg:w-1/2 min-h-[350px] sm:min-h-[450px] lg:min-h-[650px] relative flex items-center justify-center lg:justify-end order-2 mt-5 sm:mt-0 lg:translate-x-12"
                data-aos="fade-left" data-aos-delay="500"
              >
                <SpotifyCard className="relative z-10" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Home)
