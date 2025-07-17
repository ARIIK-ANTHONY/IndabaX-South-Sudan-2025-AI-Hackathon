import { motion } from "framer-motion";
import { Heart, Users, Target, Zap, Globe, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
  const stats = [
    { icon: Heart, value: "98.559%", label: "Accuracy Rate" },
    { icon: Zap, value: "<50ms", label: "Response Time" },
    { icon: Users, value: "6", label: "Disease Types" },
    { icon: Target, value: "24", label: "Blood Parameters" }
  ];

  const achievements = [
    {
      title: "Healthcare Innovation",
      description: "Democratizing medical diagnostics through AI-powered blood disease classification"
    },
    {
      title: "Real-time Processing",
      description: "Instant predictions with WebSocket connectivity for live healthcare monitoring"
    },
    {
      title: "African AI Excellence",
      description: "Showcasing South Sudan's talent in artificial intelligence and healthcare technology"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-emerald-50/30 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing healthcare diagnostics in Africa through cutting-edge AI technology, 
            making advanced blood disease detection accessible to communities across South Sudan and beyond.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To democratize healthcare diagnostics by providing accessible, accurate, and 
                  affordable AI-powered blood disease classification technology that empowers 
                  medical professionals and improves patient outcomes across Africa.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To establish South Sudan as a leader in AI-driven healthcare innovation, 
                  creating a future where advanced medical diagnostics are accessible to 
                  every community, regardless of location or economic status.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Key Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Makes Us Different
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      {achievement.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">
                Join Us in Revolutionizing Healthcare
              </h3>
              <p className="text-xl mb-8 text-emerald-100">
                Experience the future of medical diagnostics with our AI-powered platform
              </p>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200"
              >
                Try Our Demo
                <Zap className="ml-2 w-5 h-5" />
              </motion.a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
