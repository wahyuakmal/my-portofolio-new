"use client";

import React, { useState, useEffect, useRef, useId, useCallback, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* Border Beam Panel — from Motiq (https://motiq.dev/components/border-beam-panel).
   MIT licensed. Zero runtime dependencies. */

/* -------------------------------------------------------------------------- */
/* Motiq design tokens                                                        */
/* -------------------------------------------------------------------------- */
const MOTIQ_TOKENS = "@layer motiq{:root{--motiq-accent:#315fea;--motiq-accent-text:#244fd1;--motiq-bg:#f7f9fc;--motiq-border:#dce4ef;--motiq-border-strong:#c5d1e1;--motiq-fg:#101828;--motiq-fg-secondary:#344054;--motiq-muted:#667085;--motiq-secondary-accent:#009fb3;--motiq-signature:#e9564a;--motiq-surface:#ffffff;--motiq-surface-2:#f8fafd}}@layer motiq{.dark,[data-theme=\"dark\"]{--motiq-accent:#4f7cff;--motiq-accent-text:#7f9fff;--motiq-bg:#080c14;--motiq-border:#263449;--motiq-border-strong:#354863;--motiq-fg:#f8fafc;--motiq-fg-secondary:#cbd5e1;--motiq-muted:#9caabd;--motiq-secondary-accent:#22c7d9;--motiq-signature:#ff6b5e;--motiq-surface:#111827;--motiq-surface-2:#192337}}";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisibilityPause(ref, { threshold = 0.1 } = {}) {
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

class Spring {
  constructor(value, k, d) {
    this.x = value;
    this.target = value;
    this.k = k;
    this.d = d;
    this.v = 0;
  }
  step(dt) {
    const a = this.k * (this.target - this.x) - this.d * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const PARKED_ANGLE = 40;

function comet(tail, head, tip, midAlpha, start) {
  return [
    `color-mix(in srgb, ${tail} 4%, transparent) ${start + 18}deg`,
    `color-mix(in srgb, ${tail} ${midAlpha}%, transparent) ${start + 46}deg`,
    `${head} ${start + 56}deg`,
    `${tip} ${start + 60}deg`,
    `transparent ${start + 63}deg`,
  ].join(", ");
}

function ringGradient(beams, colors) {
  const tail0 = colors?.[0] ?? "var(--motiq-accent, #4f7cff)";
  const head0 = colors?.[0] ?? "var(--motiq-secondary-accent, #22c7d9)";
  const stops = [
    "transparent 0deg",
    comet(tail0, head0, `color-mix(in srgb, ${head0} 22%, #ffffff)`, 55, 0),
  ];
  if (beams === 2) {
    const c1 = colors?.[1] ?? "var(--motiq-signature, #ff6b5e)";
    stops.push("transparent 198deg", comet(c1, c1, `color-mix(in srgb, ${c1} 26%, #ffffff)`, 50, 198));
  }
  stops.push("transparent 360deg");
  return `conic-gradient(from var(--mk-beam-a, 0deg), ${stops.join(", ")})`;
}

function BorderBeamPanelBase({
  children,
  beams = 2,
  colors,
  thickness = 2,
  idleSpeed = 42,
  hoverSpeed = 240,
  glow = true,
  radius = 16,
  spring,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  className,
  style,
  ...props
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mk-beam-${uid}`;
  const rootRef = useRef(null);

  const systemReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const staticMode = reducedMotion === true || (hydrated && systemReduced);
  const onScreen = useVisibilityPause(rootRef, { threshold: 0.05 });
  const paused = pauseWhenHidden && !onScreen;
  const animate = !staticMode && !paused;

  const stiffness = spring?.stiffness ?? 30;
  const damping = spring?.damping ?? 11;

  const startAngle = useMemo(() => ((seed * 137.508) % 360 + 360) % 360, [seed]);

  const speedRef = useRef(new Spring(idleSpeed, stiffness, damping));
  const angleRef = useRef(startAngle);
  const liveRef = useRef({ idleSpeed, hoverSpeed });
  liveRef.current = { idleSpeed, hoverSpeed };

  useEffect(() => {
    speedRef.current.k = stiffness;
    speedRef.current.d = damping;
  }, [stiffness, damping]);

  const paint = useCallback((angle) => {
    if (rootRef.current) {
      rootRef.current.style.setProperty("--mk-beam-a", `${(((angle % 360) + 360) % 360).toFixed(2)}deg`);
    }
  }, []);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let last = 0;
    const frame = (now) => {
      if (!last) last = now;
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      angleRef.current += speedRef.current.step(dt) * dt;
      paint(angleRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, paint]);

  useEffect(() => {
    if (!staticMode) return;
    angleRef.current = PARKED_ANGLE;
    speedRef.current.x = speedRef.current.target = liveRef.current.idleSpeed;
    speedRef.current.v = 0;
    paint(PARKED_ANGLE);
  }, [staticMode, paint]);

  const surge = useCallback(() => {
    speedRef.current.target = liveRef.current.hoverSpeed;
  }, []);
  const settle = useCallback(() => {
    speedRef.current.target = liveRef.current.idleSpeed;
  }, []);

  const gradient = useMemo(() => ringGradient(beams, colors), [beams, colors]);

  const css = `
.${cls} .mk-beam-ring, .${cls} .mk-beam-glow {
  position: absolute;
  inset: -1px;
  border-radius: ${radius}px;
  pointer-events: none;
  background: ${gradient};
}
.${cls} .mk-beam-ring {
  padding: ${Math.max(1, thickness)}px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
.${cls} .mk-beam-glow { filter: blur(14px); opacity: 0.35; z-index: -1; }
@media (forced-colors: active) {
  .${cls} .mk-beam-ring, .${cls} .mk-beam-glow { display: none; }
  .${cls} { border-color: CanvasText; }
}`.trim();

  return (
    <div
      ref={rootRef}
      data-motion={staticMode ? "static" : "animated"}
      data-paused={paused ? "true" : "false"}
      onPointerEnter={surge}
      onPointerLeave={settle}
      onFocus={surge}
      onBlur={settle}
      className={cn(
        "relative w-full border border-[var(--motiq-border,#263449)] bg-[var(--motiq-surface,#111827)]",
        cls,
        className,
      )}
      style={{
        borderRadius: `${radius}px`,
        isolation: "isolate",
        "--mk-beam-a": `${startAngle.toFixed(2)}deg`,
        ...style,
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {glow ? <div aria-hidden="true" className="mk-beam-glow" /> : null}
      <div aria-hidden="true" className="mk-beam-ring" />
      {children}
    </div>
  );
}

export function BorderBeamPanel(props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOTIQ_TOKENS }} />
      <BorderBeamPanelBase {...props} />
    </>
  );
}

export default BorderBeamPanel;
