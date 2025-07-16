import { Brain, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-sudan-blue rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={16} />
              </div>
              <h3 className="text-xl font-bold">CodeNomads</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Advanced AI solutions for healthcare challenges. Participating in IndabaX South Sudan 2025.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Project</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
              <li><a href="#methodology" className="hover:text-white transition-colors">Methodology</a></li>
              <li><a href="#results" className="hover:text-white transition-colors">Results</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Team</h4>
            <ul className="space-y-2 text-gray-400">
              <li>ARIIK ANTHONY MATHIANG</li>
              <li>JONGKUCH CHOL ANYAR</li>
              <li>JOK JOHN MAKEER</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CodeNomads. IndabaX South Sudan 2025 AI Hackathon Project.</p>
        </div>
      </div>
    </footer>
  );
}
