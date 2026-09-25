import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

export default function GlobeMap() {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.5 }, 0);
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const markerData = [
    { lat: 37.7595, lng: -122.4367, size: 0.5, color: "cyan" },
    { lat: 40.7128, lng: -74.006, size: 0.5, color: "cyan" },
    { lat: 51.5074, lng: -0.1278, size: 0.5, color: "cyan" },
    { lat: 35.6762, lng: 139.6503, size: 0.5, color: "cyan" },
    { lat: -33.8688, lng: 151.2093, size: 0.5, color: "cyan" },
    { lat: 1.3521, lng: 103.8198, size: 0.5, color: "cyan" },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Globe
        ref={globeEl}
        width={600}
        height={600}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        pointsData={markerData}
        pointAltitude={0.01}
        pointRadius="size"
        pointColor="color"
        atmosphereColor="lightblue"
        atmosphereAltitude={0.15}
        showGraticules={true}
        enablePointerInteraction={true}
      />
    </div>
  );
}
