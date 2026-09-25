import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function GlobePulse() {
  const canvasRef = useRef();
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const fadingMarkers = useRef([]);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    const markers = [
      { location: [37.7595, -122.4367], size: 0.05 },
      { location: [40.7128, -74.006], size: 0.05 },
      { location: [51.5074, -0.1278], size: 0.05 },
      { location: [35.6762, 139.6503], size: 0.05 },
      { location: [-33.8688, 151.2093], size: 0.05 },
      { location: [1.3521, 103.8198], size: 0.05 },
    ];

    const addPulsingMarker = () => {
      const marker = markers[Math.floor(Math.random() * markers.length)];
      fadingMarkers.current.push({
        location: marker.location,
        size: 0.05,
        opacity: 1,
        scale: 1,
      });
    };

    const pulseInterval = setInterval(addPulsingMarker, 2000);

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.1, 0.1, 0.1],
      opacity: 0.9,
      offset: [0, 0],
      scale: 1,
      markers: [],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.002;
        }
        state.phi = phi + pointerInteractionMovement.current;

        fadingMarkers.current = fadingMarkers.current
          .map((marker) => ({
            ...marker,
            opacity: marker.opacity - 0.01,
            scale: marker.scale + 0.02,
          }))
          .filter((marker) => marker.opacity > 0);

        state.markers = [
          ...markers.map((m) => ({ ...m, size: 0.05 })),
          ...fadingMarkers.current.map((m) => ({
            location: m.location,
            size: m.size * m.scale,
            opacity: m.opacity,
          })),
        ];

        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => canvasRef.current && (canvasRef.current.style.opacity = "1"), 0);

    return () => {
      globe.destroy();
      clearInterval(pulseInterval);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full aspect-square max-w-[600px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-0 transition-opacity duration-500"
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            canvasRef.current.style.cursor = "grabbing";
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = "grab";
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = "grab";
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
            }
          }}
          style={{ cursor: "grab" }}
        />
      </div>
    </div>
  );
}
