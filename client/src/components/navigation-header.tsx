import { useState } from "react";
import { Brain, Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavigationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b-4 bg-sudan-blue sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-sudan-blue rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CodeNomads</h1>
              <p className="text-sm text-gray-600">IndabaX South Sudan 2025</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#live-dashboard" className="text-gray-700 hover:text-sudan-blue transition-colors">Live Dashboard</a>
            <a href="#overview" className="text-gray-700 hover:text-sudan-blue transition-colors">Overview</a>
            <a href="#team" className="text-gray-700 hover:text-sudan-blue transition-colors">Team</a>
            <a href="#results" className="text-gray-700 hover:text-sudan-blue transition-colors">Results</a>
            <a href="#demo" className="text-gray-700 hover:text-sudan-blue transition-colors">Demo</a>
            <a 
              href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sudan-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#live-dashboard" className="text-gray-700 hover:text-sudan-blue py-2">Live Dashboard</a>
              <a href="#overview" className="text-gray-700 hover:text-sudan-blue py-2">Overview</a>
              <a href="#team" className="text-gray-700 hover:text-sudan-blue py-2">Team</a>
              <a href="#results" className="text-gray-700 hover:text-sudan-blue py-2">Results</a>
              <a href="#demo" className="text-gray-700 hover:text-sudan-blue py-2">Demo</a>
              <a 
                href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sudan-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 w-fit"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
