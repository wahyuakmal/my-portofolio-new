import React, { useEffect, memo, useMemo, useState, useCallback, useRef } from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import { Code, Award, Trophy, ArrowUpRight, GraduationCap, Briefcase } from "lucide-react"
import { BorderBeamPanel } from "../components/ui/border-beam-panel"
import { supabase } from "../supabase"

const Header = memo(() => (
  <div className="text-center lg:mb-16 mb-10 px-[5%]">
    <div data-aos="fade-up" data-aos-duration="600">
      <h2
        className="section-label mx-auto"
        style={{ fontFamily: "var(--font-display)" }}
      >
        About Me
      </h2>
    </div>
  </div>
))

const ProfileImage = memo(() => {
  const [isHoveringImg, setIsHoveringImg] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const containerRef = useRef(null)
  const cursorX = useMotionValue(-1000)
  const cursorY = useMotionValue(-1000)
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const maskImage = useMotionTemplate`radial-gradient(circle 120px at ${cursorXSpring}px ${cursorYSpring}px, black 60%, transparent 100%)`

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    cursorX.set(e.clientX - rect.left)
    cursorY.set(e.clientY - rect.top)
  }, [cursorX, cursorY])

  const handleMouseLeave = useCallback(() => {
    setIsHoveringImg(false)
    cursorX.set(-1000)
    cursorY.set(-1000)
  }, [cursorX, cursorY])

  // Detect touch device — hide cursor dot on touch screens
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches)
  }, [])

  // Reset Spiderman state when section scrolls out of view (fixes mobile "nyangkut")
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsHoveringImg(false)
          cursorX.set(-1000)
          cursorY.set(-1000)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [cursorX, cursorY])

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full max-w-md mx-auto lg:max-w-none">
      <div className="relative group" data-aos="fade-up" data-aos-duration="1000">

        {/* Blended Black Background */}
        <div
          className="absolute -inset-32"
          style={{ 
            background: "radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)", 
            filter: "blur(20px)" 
          }}
        />

        <div 
          className="relative z-10"
          style={{ WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)", maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)" }}
        >
          <div
            className="w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] cursor-none relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringImg(true)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src="/wahyuu.jpeg"
              alt="Profile"
              className="absolute inset-0 w-full h-full object-contain object-bottom grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
              loading="lazy"
            />

            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={{ opacity: isHoveringImg ? 0 : [0, 0.95, 0.95, 0] }}
              transition={{
                opacity: isHoveringImg
                  ? { duration: 0.3 }
                  : { repeat: Infinity, duration: 4, repeatDelay: 2, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
              }}
            >
              <img src="/PhotoSpiderman.png" alt="Hint" className="w-full h-full object-contain object-bottom" />
            </motion.div>

            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ WebkitMaskImage: maskImage, maskImage, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}
            >
              <img src="/PhotoSpiderman.png" alt="Reveal" className="w-full h-full object-contain object-bottom" />
            </motion.div>

            <motion.div
              className="absolute w-2 h-2 rounded-full pointer-events-none z-50 mix-blend-difference"
              style={{ left: cursorXSpring, top: cursorYSpring, x: "-50%", y: "-50%", opacity: (!isTouchDevice && isHoveringImg) ? 1 : 0, background: "white" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

const StatCard = memo(({ icon: Icon, value, label, description, animation, accentColor, href, tabIndex }) => (
  <a 
    href={href} 
    onClick={() => {
      if (tabIndex !== undefined) {
        window.dispatchEvent(new CustomEvent('changeTab', { detail: { tabIndex } }));
      }
    }}
    data-aos={animation} 
    data-aos-duration={1300} 
    className="group cursor-pointer block"
  >
    <BorderBeamPanel
      className="relative rounded-2xl h-full flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-105 p-6"
      style={{
        background: "rgba(30, 41, 59, 0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.08)"
      }}
      beams={2}
      colors={[accentColor, "#ffffff"]}
      thickness={2}
      radius={16}
      glow={true}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}18 0%, transparent 70%)` }}
      />

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
        >
          <Icon className="w-6 h-6" style={{ color: "var(--col-white)" }} />
        </div>
        <span
          className="text-5xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--col-white)" }}
        >
          {value}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--col-white)", fontFamily: "var(--font-display)" }}>
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--col-muted)" }}>{description}</p>
          <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "white" }} />
        </div>

        <div
          className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />
      </div>
    </BorderBeamPanel>
  </a>
))

const AboutPage = () => {
  const [stats, setStats] = useState({ totalProjects: 0, totalCertificates: 0, totalAwards: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      // Get from local storage first for quick render
      const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]")
      const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]")
      if (storedProjects.length > 0 || storedCertificates.length > 0) {
        const certOnly = storedCertificates.filter(c => c.category === 'keahlian')
        const awardsOnly = storedCertificates.filter(c => c.category === 'prestasi')
        setStats({
          totalProjects: storedProjects.length,
          totalCertificates: certOnly.length,
          totalAwards: awardsOnly.length
        })
      }

      // Fetch fresh counts from supabase
      try {
        const [{ count: projCount }, { data: certData }] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('category')
        ])
        const certCount = certData?.filter(c => c.category === 'keahlian').length || 0;
        const awardCount = certData?.filter(c => c.category === 'prestasi').length || 0;
        
        setStats({
          totalProjects: projCount || 0,
          totalCertificates: certCount,
          totalAwards: awardCount
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  const [experiences, setExperiences] = useState([])
  const [loadingExp, setLoadingExp] = useState(true)

  useEffect(() => {
    // AOS sudah diinisialisasi di App.jsx
    const fetchExperiences = async () => {
      const { data } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })
      setExperiences(data || [])
      setLoadingExp(false)
    }
    fetchExperiences()
  }, [])

  const statsData = useMemo(() => [
    { icon: Code, value: stats.totalProjects, label: "Projects", description: "Innovative solutions crafted", animation: "fade-right", accentColor: "#2563eb", href: "#Portofolio", tabIndex: 0 },
    { icon: Award, value: stats.totalCertificates, label: "Certificates", description: "Skills validated", animation: "fade-up", accentColor: "#2563eb", href: "#Portofolio", tabIndex: 1 },
    { icon: Trophy, value: stats.totalAwards, label: "Awards", description: "Achievements earned", animation: "fade-left", accentColor: "#2563eb", href: "#Portofolio", tabIndex: 2 },
  ], [stats])

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-20 sm:mt-10"
      id="About"
      itemScope
      itemType="https://schema.org/Person"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        {/* ── Desktop Layout (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-[2.5fr_3fr_2fr] gap-6 items-center">

          {/* Left: Name */}
          <div className="min-w-0 space-y-6 text-left" data-aos="fade-right" data-aos-duration="1000">
            <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-display)" }}>
              <span className="grad-vi block">Hi, I&apos;m</span>
              <span className="block text-white mt-1 whitespace-nowrap">Wahyu</span>
              <span className="block text-white whitespace-nowrap">Syahputra</span>
              <span className="block text-white whitespace-nowrap">Akmal</span>
            </h3>
          </div>

          {/* Center: Image */}
          <div className="min-w-0 flex justify-center items-end">
            <ProfileImage />
          </div>

          {/* Right: Description + View Projects */}
          <div className="min-w-0 space-y-6 text-left" data-aos="fade-left" data-aos-duration="1000">
            <div className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--col-muted)" }}>
              <p>Management student at UIN Suska Riau with a passion for Finance & Investment. 
                Focused on trading, market analysis, and risk management. 
                  Continuously learning to become a more disciplined and analytical trader.</p>
            </div>
            <div className="mt-8">
              <a href="#Portofolio">
                <button className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 hover:bg-[rgba(37,99,235,0.08)] whitespace-nowrap"
                  style={{ border: "1px solid rgba(37,99,235,0.35)", color: "#60a5fa", fontFamily: "var(--font-display)" }}>
                  <Code className="w-4 h-4" /> View Projects
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* ── Mobile Layout (below lg) ── */}
        <div className="flex flex-col items-start gap-6 lg:hidden">
          {/* wahyu */}
          <div className="flex justify-center w-full">
            <ProfileImage />
          </div>
          {/* Name */}
          <h3 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-left w-full"
            style={{ fontFamily: "var(--font-display)" }}
            data-aos="fade-up" data-aos-duration="1000">
            <span className="grad-vi block">Hi, I&apos;m</span>
            <span className="block text-white mt-1">Wahyu Syahputa Akmal</span>
          </h3>
          {/* Description */}
          <div className="text-base sm:text-lg leading-relaxed text-left w-full" style={{ color: "var(--col-muted)" }}>
            <p>As a Management student at UIN Suska Riau, I have a strong interest in Finance & Investment, 
                particularly in market analysis, trading, and risk management. I possess skills in financial analysis, market analysis, risk management, 
                and data analysis, which I continue to develop through academic learning and practical experience.</p>
          </div>
          {/* Buttons — full width */}
          <div className="flex flex-col gap-3 w-full">
            <a href="#Portofolio" className="w-full">
              <button className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                style={{ border: "1px solid rgba(37,99,235,0.35)", color: "#60a5fa", fontFamily: "var(--font-display)" }}>
                <Code className="w-4 h-4" /> View Projects
              </button>
            </a>
          </div>
        </div>

        {/* ── Education & Experience full-width ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-14"
          data-aos="fade-up" data-aos-duration="1300"
        >
          {/* Education Column */}
          <div>
            <h4
              className="text-xl font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Education
            </h4>
            <div className="space-y-4">

              {/* Card 1 */}
              <div className="rounded-xl px-6 py-5 flex items-center gap-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-colors duration-200">
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-2xl">
                  <img src="/uin.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white leading-snug">Sultan Syarif Kasim State Islamic University Riau</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--col-muted)" }}>Department of Management | Faculty of Economics and Social Sciences</p>
                  <p className="text-sm mt-1 font-medium" style={{ color: "#93c5fd" }}>2024 – Present</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl px-6 py-5 flex items-center gap-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-colors duration-200">
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-2xl">
                  <img src="/sma.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white leading-snug">Muhammadiyah Senior High School</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--col-muted)" }}>Social Sciences Major</p>
                  <p className="text-sm mt-1 font-medium" style={{ color: "#93c5fd" }}>2021 – 2024</p>
                </div>
              </div>

            </div>
          </div>

          {/* Experience Column */}
          <div>
            <h4
              className="text-xl font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Experience
            </h4>
            <div
              className="space-y-4 overflow-y-auto pr-1"
              style={{
                maxHeight: "320px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(37,99,235,0.4) transparent",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                willChange: "scroll-position",
              }}
            >
              {/* Looping Experience dari Database */}
              {loadingExp ? (
                <div className="text-center py-4 text-gray-500 text-sm animate-pulse">Loading experiences...</div>
              ) : experiences.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">No experiences found.</div>
              ) : (
                experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-xl px-6 py-5 flex items-center gap-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-colors duration-200"
                  >
                    <div className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {exp.logo ? (
                        <img src={exp.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Briefcase className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white leading-snug">{exp.company}</p>
                      <p className="text-sm mt-0.5" style={{ color: "var(--col-muted)" }}>{exp.role}</p>
                      <p className="text-sm mt-1 font-medium" style={{ color: "#93c5fd" }}>{exp.year}</p>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {statsData.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(AboutPage)