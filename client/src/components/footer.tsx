import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-8 h-8 flex-shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Medical Cross Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    opacity="0.3"
                  />
                  
                  {/* DNA Helix / Data Strand */}
                  <path
                    d="M20 30 Q35 25 50 30 Q65 35 80 30 M20 40 Q35 35 50 40 Q65 45 80 40 M20 50 Q35 45 50 50 Q65 55 80 50 M20 60 Q35 55 50 60 Q65 65 80 60 M20 70 Q35 65 50 70 Q65 75 80 70"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.7"
                  />
                  
                  {/* Medical Cross */}
                  <rect
                    x="45"
                    y="25"
                    width="10"
                    height="50"
                    rx="5"
                    fill="url(#footerLogoGradient)"
                    filter="url(#glow)"
                  />
                  <rect
                    x="30"
                    y="40"
                    width="40"
                    height="10"
                    rx="5"
                    fill="url(#footerLogoGradient)"
                    filter="url(#glow)"
                  />
                  
                  {/* Data Points / Molecules */}
                  <circle cx="30" cy="30" r="3" fill="#60a5fa" opacity="0.8" />
                  <circle cx="70" cy="35" r="2" fill="#8b5cf6" opacity="0.7" />
                  <circle cx="25" cy="65" r="2.5" fill="#60a5fa" opacity="0.8" />
                  <circle cx="75" cy="70" r="2" fill="#06b6d4" opacity="0.9" />
                  
                  {/* Heartbeat Line */}
                  <path
                    d="M15 85 L25 85 L30 75 L35 95 L40 70 L45 90 L50 85 L85 85"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">CodeNomads</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Advanced AI solutions for healthcare challenges. Participating in IndabaX South Sudan 2025.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Github size={20} />
              </a>
              <button className="text-gray-500 hover:text-gray-900 transition-colors">
                <Linkedin size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter size={20} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Project</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#overview" className="hover:text-gray-900 transition-colors">Overview</a></li>
              <li><a href="#methodology" className="hover:text-gray-900 transition-colors">Methodology</a></li>
              <li><a href="#results" className="hover:text-gray-900 transition-colors">Results</a></li>
              <li><a href="#demo" className="hover:text-gray-900 transition-colors">Demo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Team</h4>
            <ul className="space-y-2 text-black">
              <li>ARIIK ANTHONY MATHIANG</li>
              <li>JONGKUCH CHOL ANYAR</li>
              <li>JOK JOHN MAKEER</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 CodeNomads. IndabaX South Sudan 2025 AI Hackathon Project.</p>
        </div>
      </div>
    </footer>
  );
}
