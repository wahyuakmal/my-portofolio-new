import React, { useEffect, useState, useCallback, useRef, useMemo, memo } from "react";
import { supabase } from "../supabase";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, Trophy } from "lucide-react";

/* ── Toggle Button ── */
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}>
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

/* ── Tech Stacks Data ── */
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "supabase.svg", language: "Supabase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "figma.svg", language: "Figma" },
];

/* ── Tab definitions ── */
const TABS = [
  { label: "Projects",     icon: Code },
  { label: "Certificates", icon: Award },
  { label: "Awards",       icon: Trophy },
  { label: "Tech Stack",   icon: Boxes },
];

export default function FullWidthTabs() {
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [awards, setAwards] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);

  // Touch / swipe support
  const touchStartX = useRef(null);

  // Read once at mount and update on resize, not on every render
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for custom event to change tab from other components
  useEffect(() => {
    const handleTabChange = (e) => {
      if (e.detail && typeof e.detail.tabIndex === 'number') {
        setValue(e.detail.tabIndex);
      }
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("certificates").select("*").order("id", { ascending: false }),
      ]);
      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      const projectData = projectsResponse.data || [];
      const allCertData = certificatesResponse.data || [];
      const certData = allCertData.filter((c) => c.category === "keahlian");
      const awardData = allCertData.filter((c) => c.category === "prestasi");

      setProjects(projectData);
      setCertificates(certData);
      setAwards(awardData);
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(allCertData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem("projects");
    const cachedCertificates = localStorage.getItem("certificates");
    if (cachedProjects && cachedCertificates) {
      setProjects(JSON.parse(cachedProjects));
      const allCerts = JSON.parse(cachedCertificates);
      setCertificates(allCerts.filter((c) => c.category === "keahlian"));
      setAwards(allCerts.filter((c) => c.category === "prestasi"));
    }
    fetchData();
  }, [fetchData]);

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") setShowAllProjects((prev) => !prev);
    else if (type === "certificates") setShowAllCertificates((prev) => !prev);
    else if (type === "awards") setShowAllAwards((prev) => !prev);
  }, []);

  // Swipe handlers — wrapped in useCallback to avoid re-creation each render
  const handleTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setValue((prev) => diff > 0 ? Math.min(prev + 1, TABS.length - 1) : Math.max(prev - 1, 0));
    }
    touchStartX.current = null;
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);
  const displayedAwards = showAllAwards ? awards : awards.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden" id="Portofolio">

      {/* Header */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="section-label" style={{ fontFamily: "var(--font-display)" }}>
          Portofolio
        </h2>
      </div>

      {/* Tab Bar */}
      <div
        className="relative flex rounded-[20px] overflow-hidden mb-6"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.07)",
          background: "rgba(37, 99, 235, 0.04)",
          backdropFilter: "blur(10px)",
        }}
      >
        {TABS.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            onClick={() => setValue(i)}
            className={`flex-1 flex flex-col items-center gap-1.5 px-2 py-4 text-xs md:text-[0.95rem] font-semibold rounded-[12px] mx-1 my-2 transition-all duration-300
              ${value === i
                ? "text-white bg-[rgba(37,99,235,0.18)] shadow-[0_4px_15px_-3px_rgba(37,99,235,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-[rgba(37,99,235,0.1)] hover:-translate-y-[2px]"
              }`}
          >
            <Icon className="w-5 h-5 transition-all duration-300" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content — swipeable */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full"
      >
        {/* Tab 0 — Projects */}
        {value === 0 && (
          <div className="px-1 sm:px-3 py-4">
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.img || ""}
                      Title={project.title || ""}
                      Description={project.description || ""}
                      Link={project.link || ""}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => toggleShowMore("projects")} isShowingMore={showAllProjects} />
              </div>
            )}
          </div>
        )}

        {/* Tab 1 — Certificates */}
        {value === 1 && (
          <div className="px-1 sm:px-3 py-4">
            {certificates.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No certificates yet.</p>
              </div>
            ) : (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 w-full">
                    {displayedCertificates.map((certificate, index) => (
                      <div
                        key={certificate.id || index}
                        data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                        data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                      >
                        <Certificate ImgSertif={certificate.img} />
                      </div>
                    ))}
                  </div>
                </div>
                {certificates.length > initialItems && (
                  <div className="mt-6 w-full flex justify-start">
                    <ToggleButton onClick={() => toggleShowMore("certificates")} isShowingMore={showAllCertificates} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 2 — Awards */}
        {value === 2 && (
          <div className="px-1 sm:px-3 py-4">
            {awards.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No awards yet.</p>
              </div>
            ) : (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 w-full">
                    {displayedAwards.map((award, index) => (
                      <div
                        key={award.id || index}
                        data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                        data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                      >
                        <Certificate ImgSertif={award.img} />
                      </div>
                    ))}
                  </div>
                </div>
                {awards.length > initialItems && (
                  <div className="mt-6 w-full flex justify-start">
                    <ToggleButton onClick={() => toggleShowMore("awards")} isShowingMore={showAllAwards} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 3 — Tech Stack */}
        {value === 3 && (
          <div className="px-1 sm:px-3 py-4">
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}