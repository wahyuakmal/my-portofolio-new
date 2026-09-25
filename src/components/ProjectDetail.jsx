import { supabase } from "../supabase";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  ChevronRight,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
} from "lucide-react";
import { toSlug } from "../utils/slug";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      const { data } = await supabase.from("projects").select("*");
      const selectedProject = data?.find((p) => toSlug(p.title) === slug);
      if (selectedProject) {
        setProject(selectedProject);
      }
    };
    fetchProject();
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Loading Project...
          </h2>
        </div>
      </div>
    );
  }

  const projectUrl = `https://wahyusyahputraakmal-portofolio.vercel.app/project/${toSlug(project.title)}`;

  return (
    <>
      <Helmet>
        <title>{project.title} — Wahyu Syahputra Akmal</title>
        <meta name="description" content={project.description ? project.description.slice(0, 155) : `Project ${project.title} oleh Wahyu Syahputra Akmal.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta property="og:title" content={`${project.title} — Wahyu Syahputra Akmal`} />
        <meta property="og:description" content={project.description?.slice(0, 155)} />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.img && <meta property="og:image" content={project.img} />}
      </Helmet>

      <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
        <div className="fixed inset-0">
          <div className="absolute -inset-[10px] opacity-20">
            <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12">
              <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
                <span>Projects</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-white/90 truncate">{project.title}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-blue-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                    {project.title}
                  </h1>
                  <div className="relative h-1 w-16 md:w-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm" />
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-white/90 flex items-center gap-2 md:gap-3">
                    <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    Technologies Used
                  </h3>
                  {project.tech_stack?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.tech_stack.map((tech, index) => (
                        <TechBadge key={index} tech={tech} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-gray-400 opacity-50">
                      No technologies added.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6 md:space-y-10">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </div>
    </>
  );
};

export default ProjectDetails;