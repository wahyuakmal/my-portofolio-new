import React, { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { Maximize2, X } from "lucide-react"

const Certificate = ({ ImgSertif }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = useCallback(() => setOpen(false), [])

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === "Escape") handleClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, handleClose])

  // Cegah scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <div className="w-full">
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
        onClick={handleOpen}
      >
        {/* Dark overlay on top of image */}
        <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none" />

        <div 
          className="w-full bg-gray-900 flex items-center justify-center overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <img
            src={ImgSertif}
            alt="Certificate"
            loading="lazy"
            className="certificate-image w-full h-full object-cover transition-[filter] duration-300"
            style={{
              filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
            }}
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-white text-center transition-all duration-400 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
            <Maximize2 className="w-10 h-10 drop-shadow-md" />
            <span className="text-base font-semibold drop-shadow-md">View Certificate</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(5px)" }}
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-white bg-black/60 hover:bg-black/80 hover:scale-110 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image */}
          <img
            src={ImgSertif}
            alt="Certificate Full View"
            className="max-w-full max-h-[90vh] object-contain mx-auto rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  )
}

export default Certificate
