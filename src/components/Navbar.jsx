import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Briefcase, Mail } from "lucide-react"

// Simple class merger
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

const navItems = [
  { name: "Home", url: "#Home", icon: Home },
  { name: "About", url: "#About", icon: User },
  { name: "Portfolio", url: "#Portofolio", icon: Briefcase },
  { name: "Contact", url: "#Contact", icon: Mail },
]

export default function Navbar({ defaultActive = "Home" }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultActive)
  const [isMobile, setIsMobile] = useState(false)
  const isScrolling = React.useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return
      const sections = navItems.map(item => {
        const section = document.querySelector(item.url)
        if (section) {
          return { id: item.name, offset: section.offsetTop - 550, height: section.offsetHeight }
        }
        return null
      }).filter(Boolean)

      const currentPosition = window.scrollY
      const active = sections.find(s => currentPosition >= s.offset && currentPosition < s.offset + s.height)
      if (active) setActiveTab(active.id)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (e, url, name) => {
    e.preventDefault()
    const section = document.querySelector(url)
    if (section) {
      isScrolling.current = true
      setActiveTab(name)
      window.scrollTo({ top: section.offsetTop - 80, behavior: "smooth" })
      
      // Mengaktifkan kembali deteksi scroll setelah animasi selesai (sekitar 1 detik)
      setTimeout(() => {
        isScrolling.current = false
      }, 1000)
    }
  }

  if (!mounted) return null

  return (
    <div className="fixed top-5 left-0 right-0 z-[9999]">
      <div className="flex justify-center pt-6">
        <motion.div 
          className="flex items-center gap-3 bg-[#1e293b]/50 border border-white/10 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <a
                key={item.name}
                href={item.url}
                onClick={(e) => scrollToSection(e, item.url, item.name)}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer text-xs md:text-sm font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full transition-all duration-300",
                  "text-white/70 hover:text-white",
                  isActive && "text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-500/25 rounded-full blur-md" />
                    <div className="absolute inset-[-4px] bg-blue-500/20 rounded-full blur-xl" />
                    <div className="absolute inset-[-8px] bg-blue-500/15 rounded-full blur-2xl" />
                    <div className="absolute inset-[-12px] bg-blue-500/5 rounded-full blur-3xl" />
                    
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"
                      style={{
                        animation: "shine 3s ease-in-out infinite"
                      }}
                    />
                  </motion.div>
                )}

                <motion.span
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
          
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="anime-mascot"
                    className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="relative w-12 h-12">
                      <motion.div 
                        className="absolute w-10 h-10 bg-white rounded-full left-1/2 -translate-x-1/2"
                        animate={
                          hoveredTab ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0],
                            transition: {
                              duration: 0.5,
                              ease: "easeInOut"
                            }
                          } : {
                            y: [0, -3, 0],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }
                        }
                      >
                        <motion.div 
                          className="absolute w-2 h-2 bg-black rounded-full"
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.2, 1],
                              transition: {
                                duration: 0.2,
                                times: [0, 0.5, 1]
                              }
                            } : {}
                          }
                          style={{ left: '25%', top: '40%' }}
                        />
                        <motion.div 
                          className="absolute w-2 h-2 bg-black rounded-full"
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.2, 1],
                              transition: {
                                duration: 0.2,
                                times: [0, 0.5, 1]
                              }
                            } : {}
                          }
                          style={{ right: '25%', top: '40%' }}
                        />
                        <motion.div 
                          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
                          animate={{
                            opacity: hoveredTab ? 0.8 : 0.6
                          }}
                          style={{ left: '15%', top: '55%' }}
                        />
                        <motion.div 
                          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
                          animate={{
                            opacity: hoveredTab ? 0.8 : 0.6
                          }}
                          style={{ right: '15%', top: '55%' }}
                        />
                        
                        <motion.div 
                          className="absolute w-4 h-2 border-b-2 border-black rounded-full"
                          animate={
                            hoveredTab ? {
                              scaleY: 1.5,
                              y: -1
                            } : {
                              scaleY: 1,
                              y: 0
                            }
                          }
                          style={{ left: '30%', top: '60%' }}
                        />
                        <AnimatePresence>
                          {hoveredTab && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300"
                              >
                                ✨
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ delay: 0.1 }}
                                className="absolute -top-2 left-0 w-2 h-2 text-yellow-300"
                              >
                                ✨
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
                        animate={
                          hoveredTab ? {
                            y: [0, -4, 0],
                            transition: {
                              duration: 0.3,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }
                          } : {
                            y: [0, 2, 0],
                            transition: {
                              duration: 1,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5
                            }
                          }
                        }
                      >
                        <div className="w-full h-full bg-white rotate-45 transform origin-center" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </a>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}