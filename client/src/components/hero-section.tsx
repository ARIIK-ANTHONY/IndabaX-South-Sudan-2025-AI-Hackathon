import { useQuery } from "@tanstack/react-query";
import { Play, Microscope, ArrowRight, Sparkles, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Logo from "./logo";

interface StatsData {
  totalSamples: number;
  testSamples: number;
  medicalFeatures: number;
  engineeredFeatures: number;
  diseaseClasses: number;
  targetAccuracy: number;
  trainingAccuracy: number;
  validationAccuracy: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

export default function HeroSection() {
  // Modern diabetes prediction dashboard
  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 to-red-50 border-b border-gray-200 text-gray-800 overflow-hidden">
      {/* Warm, welcoming background with bold accents */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50"></div>
        {/* Bold geometric pattern */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.1) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        {/* Bold floating accent shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-200 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-red-300 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <Logo size="xl" variant="dark" animated={true} />
          </motion.div>

          {/* Bold, attention-grabbing badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-orange-100 border-2 border-orange-400 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2 text-orange-600" />
              <span className="text-sm font-bold text-orange-800">Revolutionary Medical AI</span>
            </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-gray-900"
          >
            <span className="text-red-700">Life-Saving</span> Blood Disease Detection
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl mb-16 text-gray-800 max-w-4xl mx-auto leading-relaxed"
          >
            Empowering healthcare professionals with intelligent, accurate blood disease diagnosis. 
            Our AI combines <span className="text-red-800 font-bold">cutting-edge technology</span> with 
            <span className="text-orange-800 font-bold"> human compassion</span> to deliver reliable results you can trust.
          </motion.p>
          
          {/* Human-centered stats grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto"
          >
            {[
              { value: `${stats?.targetAccuracy || 98.55}%+`, label: "Accuracy Rate", icon: Brain, color: "from-emerald-400 to-emerald-600" },
              { value: stats?.medicalFeatures || 24, label: "Health Markers", icon: Activity },
              { value: stats?.diseaseClasses || 6, label: "Conditions", icon: Microscope },
              { value: (stats?.totalSamples || 0).toLocaleString(), label: "Patient Data", icon: Sparkles }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group relative"
                whileHover={{ scale: 1.03, y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative bg-white rounded-2xl p-6 border-2 border-red-400 hover:border-red-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                    <stat.icon className="w-6 h-6 text-red-700" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-red-700 font-bold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Warm, human-centered CTA buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild
                size="lg"
                className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all duration-300 border-0"
              >
                <a href="#demo" className="flex items-center">
                  <Play className="mr-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Try Live Demo
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline"
                asChild
                size="lg"
                className="group border-2 border-orange-600 text-orange-700 bg-orange-50 px-8 py-4 rounded-xl text-lg font-bold hover:bg-orange-100 hover:border-orange-700 transition-all duration-300"
              >
                <a href="#live-dashboard" className="flex items-center">
                  <Activity className="mr-3 w-5 h-5 group-hover:scale-105 transition-transform" />
                  View Dashboard
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
