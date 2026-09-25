import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

const defaultMarkers = [
  { id: "cdn-iad", location: [38.95, -77.45], region: "iad1" },
  { id: "cdn-sfo", location: [37.62, -122.38], region: "sfo1" },
  { id: "cdn-cdg", location: [49.01, 2.55], region: "cdg1" },
  { id: "cdn-hnd", location: [35.55, 139.78], region: "hnd1" },
  { id: "cdn-syd", location: [-33.95, 151.18], region: "syd1" },
  { id: "cdn-gru", location: [-23.43, -46.47], region: "gru1" },
  { id: "cdn-sin", location: [1.36, 103.99], region: "sin1" },
  { id: "cdn-arn", location: [59.65, 17.93], region: "arn1" },
  { id: "cdn-dub", location: [53.43, -6.25], region: "dub1" },
  { id: "cdn-bom", location: [19.09, 72.87], region: "bom1" },
]

const defaultArcs = [
  { id: "cdn-arc-1", from: [38.95, -77.45], to: [49.01, 2.55] },
  { id: "cdn-arc-2", from: [37.62, -122.38], to: [35.55, 139.78] },
  { id: "cdn-arc-3", from: [49.01, 2.55], to: [1.36, 103.99] },
  { id: "cdn-arc-4", from: [38.95, -77.45], to: [-23.43, -46.47] },
  { id: "cdn-arc-5", from: [35.55, 139.78], to: [-33.95, 151.18] },
  { id: "cdn-arc-6", from: [49.01, 2.55], to: [19.09, 72.87] },
]

const traffic = defaultArcs.map((arc, index) => ({
  id: arc.id,
  value: [420, 380, 290, 185, 156, 134][index] || 100,
}))

function CobeGlobe({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className = "",
  speed = 0.003,
}) {
  const isCompactLayout = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches
  const canvasRef = useRef(null)
  const pointerInteracting = useRef(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe = null
    let animationId = 0
    let revealTimer = 0
    let resizeObserver = null
    let phi = 0
    let lastFrameTime = 0
    let isInView = true
    let isPageVisible = document.visibilityState !== "hidden"
    const compactDevice = isCompactLayout
    const frameDuration = 1000 / (compactDevice ? 30 : 45)

    const shouldAnimate = () => isInView && isPageVisible

    const animate = (now) => {
      animationId = 0
      if (!globe || !shouldAnimate()) return

      if (now - lastFrameTime >= frameDuration) {
        lastFrameTime = now
        if (!isPausedRef.current) phi += speed
        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })
      }
      animationId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (!animationId && globe && shouldAnimate()) {
        animationId = requestAnimationFrame(animate)
      }
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView) startAnimation()
      },
      { threshold: 0.05 },
    )

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState !== "hidden"
      if (isPageVisible) startAnimation()
    }

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, compactDevice ? 1 : 1.5),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1, // Dark theme
        diffuse: 1.2,
        mapSamples: compactDevice ? 6000 : 10000,
        mapBrightness: 6,
        baseColor: [1, 1, 1], // White dots
        markerColor: [0.38, 0.65, 1], // Light Blue markers
        glowColor: [0.1, 0.2, 0.5], // Navy blue glow
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: 0.012, id: m.id })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
        arcColor: [0.38, 0.65, 1], // Light blue arcs
        arcWidth: 0.8,
        arcHeight: 0.25,
        opacity: 0.8,
      })
      visibilityObserver.observe(canvas)
      document.addEventListener("visibilitychange", handleVisibilityChange)
      startAnimation()
      revealTimer = window.setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          resizeObserver.disconnect()
          init()
        }
      })
      resizeObserver.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (revealTimer) clearTimeout(revealTimer)
      if (resizeObserver) resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (globe) globe.destroy()
    }
  }, [markers, arcs, speed, isCompactLayout])

  const pyramidFaceStyle = (nth) => {
    const transforms = [
      "rotateY(0deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(120deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(240deg) translateZ(4px) rotateX(19.5deg)",
      "rotateX(-90deg) rotateZ(60deg) translateY(4px)",
    ]
    const colors = ["#111", "#333", "#555", "#222"]
    return {
      position: "absolute",
      left: -0.5,
      top: 0,
      width: 0,
      height: 0,
      borderLeft: "6.5px solid transparent",
      borderRight: "6.5px solid transparent",
      borderBottom: `13px solid ${colors[nth]}`,
      transformOrigin: "center bottom",
      transform: transforms[nth],
    }
  }

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pyramid-spin {
          0% { transform: rotateX(20deg) rotateY(0deg); }
          100% { transform: rotateX(20deg) rotateY(360deg); }
        }
      `}</style>
      {/* Background glow circle so the globe doesn't look empty */}
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)", filter: "blur(20px)" }} />
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            pointerEvents: "none",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              position: "relative",
              transformStyle: "preserve-3d",
              animation: isCompactLayout ? "none" : "pyramid-spin 4s linear infinite",
            }}
          >
            {[0, 1, 2, 3].map((n) => (
              <div key={n} style={pyramidFaceStyle(n)} />
            ))}
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.55rem",
              color: "#fff",
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            {m.region}
          </span>
        </div>
      ))}
      {traffic.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-arc-${t.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            fontFamily: "monospace",
            fontSize: "0.5rem",
            color: "#fff",
            background: "#000",
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: `var(--cobe-visible-arc-${t.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-arc-${t.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          {t.value}k req/s
        </div>
      ))}
    </div>
  )
}

export default CobeGlobe;
