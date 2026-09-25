import React, { useEffect, useRef } from "react";

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;

    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) +
      Math.pow(this.pos.y - this.target.y, 2)
    );

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    );
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx, drawAsPoints) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;

    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize);
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2, width, height);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }

  generateRandomPos(x, y, mag, width, height) {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

export function ParticleTextEffect() {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const offscreenCanvasRef = useRef(null);
  const frameCountRef = useRef(0);

  // Use a denser particle map to make it look more solid initially
  const pixelSteps = 4; 
  const drawAsPoints = false; // draw as circles so they overlap nicely

  const generateRandomPos = (x, y, mag, width, height) => {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;
    const direction = { x: randomX - x, y: randomY - y };
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }
    return { x: x + direction.x, y: y + direction.y };
  };

  // cssW/cssH are the CSS pixel dimensions (not physical); used for text layout and particle coords
  const drawText = (canvas, cssW, cssH) => {
    frameCountRef.current = 0; // reset animation frame
    const offscreenCanvas = document.createElement("canvas");
    // Offscreen canvas works in CSS pixels — no DPR scaling needed here
    offscreenCanvas.width  = cssW;
    offscreenCanvas.height = cssH;
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });
    offscreenCanvasRef.current = offscreenCanvas;

    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";

    // Responsive font sizes — scale against CSS width, not physical width
    const widthRatio = Math.min(1, cssW / 800);
    const fontSize1  = 65 * widthRatio;
    const fontSize2  = 80 * widthRatio;

    // "Welcome To My"
    offscreenCtx.font = `bold ${fontSize1}px Arial, sans-serif`;
    const gradient = offscreenCtx.createLinearGradient(
      cssW / 2 - 250, 0,
      cssW / 2 + 250, 0
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#dbeafe");
    gradient.addColorStop(1, "#bfdbfe");
    offscreenCtx.fillStyle = gradient;
    offscreenCtx.fillText("Welcome To My", cssW / 2, cssH / 2 - (fontSize1 * 0.7));

    // "Portofolio Website"
    offscreenCtx.font = `bold ${fontSize2}px Arial, sans-serif`;
    offscreenCtx.fillStyle = "#2563eb";
    offscreenCtx.fillText("Portofolio Website", cssW / 2, cssH / 2 + (fontSize2 * 0.7));

    const imageData = offscreenCtx.getImageData(0, 0, cssW, cssH);
    const pixels    = imageData.data;

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }
    // Shuffle for random assembly order
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const alpha = pixels[coordIndex + 3];
      if (alpha > 0) {
        // Pixel coordinates in CSS space
        const x = (coordIndex / 4) % cssW;
        const y = Math.floor(coordIndex / 4 / cssW);

        let particle;
        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const randomPos = generateRandomPos(cssW / 2, cssH / 2, (cssW + cssH) / 2, cssW, cssH);
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;
          particle.maxSpeed = Math.random() * 8 + 8;
          particle.maxForce = particle.maxSpeed * 0.1;
          particle.particleSize = 3;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = {
          r: pixels[coordIndex],
          g: pixels[coordIndex + 1],
          b: pixels[coordIndex + 2],
        };
        particle.colorWeight = 0;
        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(cssW, cssH);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip rendering when tab is in background to save CPU/GPU
    if (document.hidden) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext("2d");
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCountRef.current++;
    
    // Calculate how much the solid text should fade in
    let textOpacity = 0;
    if (frameCountRef.current > 90) {
      textOpacity = Math.min(1, (frameCountRef.current - 90) / 60);
    }

    // Fade out particles so no dots are visible once text is perfectly solid
    ctx.globalAlpha = 1 - textOpacity;

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.move();
      particle.draw(ctx, drawAsPoints);

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 || particle.pos.x > canvas.width ||
          particle.pos.y < 0 || particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1);
        }
      }
    }

    // Reset global alpha and draw the perfect solid text
    ctx.globalAlpha = 1.0;
    if (offscreenCanvasRef.current && textOpacity > 0) {
      ctx.globalAlpha = textOpacity;
      ctx.drawImage(offscreenCanvasRef.current, 0, 0);
      ctx.globalAlpha = 1.0;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scale canvas by devicePixelRatio for crisp rendering on HiDPI / Retina / mobile screens
    const updateSize = () => {
      const dpr  = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x to avoid excess memory
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      // Physical pixel dimensions
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;

      // CSS display size stays full screen
      canvas.style.width  = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      // Scale context so all drawing uses CSS pixel coordinates
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      // Pass CSS dims so drawText uses correct coordinate space
      drawText(canvas, cssW, cssH);
    };

    updateSize();
    animate();

    window.addEventListener("resize", updateSize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="block"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
