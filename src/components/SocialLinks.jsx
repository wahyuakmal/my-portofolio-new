import { useEffect } from "react";
import {
  ExternalLink,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import PresenceWidget from "./PresenceWidget";

const socialLinks = [
  {
    name: "Tiktok",
    displayName: "Tiktok",
    subText: "@alhafizh117",
    icon: "/tiktok1.png",
    url: "https://www.tiktok.com/@alhafizh117",
    color: "#000000",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    isPrimary: true,
  },
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: "@wahyusyahputraakmal",
    icon: "/Instagram_icon.png",
    url: "https://www.instagram.com/@wahyusyahputraakmal",
    color: "#E4405F",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]",
  },
 
  {
    name: "GitHub",
    displayName: "Github",
    subText: "@wahyusyahputraakmal",
    icon: "/github.png",
    url: "https://github.com/@wahyusyahputraakmal",
    color: "#ffffff",
    gradient: "from-[#333] to-[#24292e]",
  },

];

const SocialLinks = () => {
  const linkedIn = socialLinks.find((link) => link.isPrimary);
  const otherLinks = socialLinks.filter((link) => !link.isPrimary);
  const [instagram, github] = otherLinks;

  useEffect(() => {
    AOS.init({
      offset: 10,
     
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3
        className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
        data-aos="fade-down" 
      >
        FIND ME
      </h3>

      <div className="flex flex-col gap-4">
        {/* LinkedIn - Primary Row */}
        <a
          href={linkedIn.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 p-4 rounded-xl 
                     bg-white/5 border border-white/10 overflow-hidden
                     hover:border-white/20 transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="100" 
        >
          {/* Hover Gradient Background */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                       bg-gradient-to-r ${linkedIn.gradient}`}
          />

          {/* Icon Container */}
          <div className="relative flex items-center justify-center p-2">
            <img
              src={linkedIn.icon}
              alt={linkedIn.name}
              className="w-10 h-10 object-contain transition-all duration-500 group-hover:scale-110"
            />
          </div>

          {/* Text Container */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
              {linkedIn.displayName}
            </span>
            <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
              {linkedIn.subText}
            </span>
          </div>

          {/* External Link */}
          <ExternalLink
            className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                       opacity-0 group-hover:opacity-100 transition-all duration-300
                       transform group-hover:translate-x-0 -translate-x-2"
          />

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            />
          </div>
        </a>

        {/* Second Row - Instagram & YouTube */}
        <div className="grid grid-cols-1 gap-4">
          {[instagram].map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 p-4 rounded-xl 
                               bg-white/5 border border-white/10 overflow-hidden
                               hover:border-white/20 transition-all duration-500"
              data-aos="fade-up" 
              data-aos-delay={200 + index * 100} 
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                     bg-gradient-to-r ${link.gradient}`}
              />

              <div className="relative flex items-center justify-center p-2">
                <img
                  src={link.icon}
                  alt={link.name}
                  className="w-10 h-10 object-contain transition-all duration-500 group-hover:scale-110"
                />
              </div>

              {/* Text Container */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                  {link.subText}
                </span>
              </div>

              <ExternalLink
                className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                                       opacity-0 group-hover:opacity-100 transition-all duration-300
                                       transform group-hover:translate-x-0 -translate-x-2"
              />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Third Row - GitHub & TikTok */}
        <div className="grid grid-cols-1 gap-4">
          {[github].map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 p-4 rounded-xl 
                               bg-white/5 border border-white/10 overflow-hidden
                               hover:border-white/20 transition-all duration-500"
              data-aos="fade-up" 
              data-aos-delay={400 + index * 100}
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                     bg-gradient-to-r ${link.gradient}`}
              />

              <div className="relative flex items-center justify-center p-2">
                <img
                  src={link.icon}
                  alt={link.name}
                  className="w-10 h-10 object-contain transition-all duration-500 group-hover:scale-110"
                />
              </div>

              {/* Text Container */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                  {link.subText}
                </span>
              </div>

              <ExternalLink
                className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                                       opacity-0 group-hover:opacity-100 transition-all duration-300
                                       transform group-hover:translate-x-0 -translate-x-2"
              />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>
            </a>
          ))}
        </div>
  
      </div>
    </div>
  );
};

export default SocialLinks;