import { Card, CardContent } from "@/components/ui/card";
import { TEAM_MEMBERS } from "@/lib/constants";
import { Linkedin, Github, User } from "lucide-react";

export default function TeamSection() {
  const avatarColors = ["bg-sudan-blue", "bg-sudan-yellow", "bg-sudan-red"];
  
  // Define team member images from dist/public directory
  const teamImages = {
    "ARIIK ANTHONY MATHIANG": "/Ariik.jpg",
    "JONGKUCH CHOL ANYAR": "/jongkuch.jpg",
    "JOK JOHN MAKEER": "/jok.jpg"
  };

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Team CodeNomads</h2>
          <p className="text-xl text-gray-600">
            Passionate AI researchers dedicated to advancing healthcare through technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <Card key={member.name} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className={`w-24 h-24 ${avatarColors[index]} rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden relative`}>
                  <img
                    src={teamImages[member.name as keyof typeof teamImages]}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to User icon if image fails to load
                      console.error(`Failed to load image for ${member.name}:`, teamImages[member.name as keyof typeof teamImages]);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallbackIcon = target.parentElement?.querySelector('.fallback-icon');
                      if (fallbackIcon) {
                        fallbackIcon.classList.remove('hidden');
                      }
                    }}
                    onLoad={(e) => {
                      // Hide fallback icon when image loads successfully
                      console.log(`Successfully loaded image for ${member.name}`);
                      const target = e.target as HTMLImageElement;
                      const fallbackIcon = target.parentElement?.querySelector('.fallback-icon');
                      if (fallbackIcon) {
                        fallbackIcon.classList.add('hidden');
                      }
                    }}
                  />
                  <User className="fallback-icon text-white absolute inset-0 m-auto" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="sudan-blue font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-sudan-blue transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-sudan-blue transition-colors"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
