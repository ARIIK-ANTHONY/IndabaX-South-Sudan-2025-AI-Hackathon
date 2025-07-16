import { useState, useEffect } from "react";
import { Brain, Github, Menu, X, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavigationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glassmorphism-nav py-2' 
        : 'glassmorphism-nav py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 slide-in-left">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg floating-shadow">
                <Brain className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
                <Activity className="text-white" size={10} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">CodeNomads</h1>
              <p className="text-sm font-medium text-neutral-600">IndabaX South Sudan 2025</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="#live-dashboard" icon={<Activity size={16} />}>
              Live Dashboard
            </NavLink>
            <NavLink href="#overview">Overview</NavLink>
            <NavLink href="#team">Team</NavLink>
            <NavLink href="#results">Results</NavLink>
            <NavLink href="#demo" icon={<Zap size={16} />}>
              Demo
            </NavLink>
            
            <div className="ml-4">
              <a 
                href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-primary text-white px-6 py-3 rounded-2xl font-semibold button-hover inline-flex items-center gap-2 floating-shadow"
              >
                <Github size={18} />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-3"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-6 slide-up">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <MobileNavLink href="#live-dashboard" icon={<Activity size={20} />}>
                Live Dashboard
              </MobileNavLink>
              <MobileNavLink href="#overview">Overview</MobileNavLink>
              <MobileNavLink href="#team">Team</MobileNavLink>
              <MobileNavLink href="#results">Results</MobileNavLink>
              <MobileNavLink href="#demo" icon={<Zap size={20} />}>
                Demo
              </MobileNavLink>
              
              <div className="pt-4 border-t border-neutral-200">
                <a 
                  href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-primary text-white px-6 py-3 rounded-2xl font-semibold button-hover inline-flex items-center gap-3 w-full justify-center"
                >
                  <Github size={20} />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-neutral-700 hover:text-primary font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:bg-neutral-100/50 inline-flex items-center gap-2"
    >
      {icon}
      {children}
    </a>
  );
}

function MobileNavLink({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-neutral-700 hover:text-primary font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:bg-neutral-100/50 inline-flex items-center gap-3 w-full"
    >
      {icon}
      {children}
    </a>
  );
}
