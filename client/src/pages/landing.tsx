import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Shield, 
  Sparkles, 
  Users, 
  Star,
  ArrowRight,
  Play,
  Volume2,
  VolumeX
} from "lucide-react";

const statsData = [
  { number: "10K+", label: "Anonymous Whispers", icon: MessageCircle },
  { number: "5K+", label: "Community Members", icon: Users },
  { number: "50+", label: "Daily Connections", icon: Heart },
  { number: "100%", label: "Anonymous & Safe", icon: Shield },
];

const featuresData = [
  {
    icon: Heart,
    title: "Express Yourself",
    description: "Share your deepest thoughts and feelings in a safe, anonymous space.",
    gradient: "from-coral to-sunset-orange"
  },
  {
    icon: Shield,
    title: "Complete Anonymity",
    description: "No registration required. Your identity remains completely private.",
    gradient: "from-lavender to-deep-purple"
  },
  {
    icon: MessageCircle,
    title: "Connect & Support",
    description: "Find understanding and empathy through shared human experiences.",
    gradient: "from-electric-blue to-lavender"
  },
  {
    icon: Sparkles,
    title: "Poetic Expression",
    description: "200-character limit encourages concise, meaningful whispers.",
    gradient: "from-soft-pink to-coral"
  }
];

const testimonials = [
  {
    text: "Whispering Walls gave me a safe space to share my thoughts when I needed it most.",
    mood: "grateful",
    color: "coral"
  },
  {
    text: "The anonymity here lets me be truly authentic. It's incredibly freeing.",
    mood: "liberated", 
    color: "lavender"
  },
  {
    text: "I found so much comfort in reading others' experiences. We're not alone.",
    mood: "connected",
    color: "electric-blue"
  }
];

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-midnight overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{ y: backgroundY }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-coral/20 to-lavender/20 rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
            }}
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-electric-blue/20 to-soft-pink/20 rounded-full blur-3xl"
            style={{
              transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
            }}
          />
          
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Badge className="neon-glow bg-gradient-to-r from-coral to-lavender text-white px-6 py-2 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Anonymous • Safe • Supportive
            </Badge>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight"
          >
            <span className="gradient-text">Whispering</span>
            <br />
            <span className="text-white">Walls</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-cool-gray max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Share your deepest thoughts, confessions, and secrets in a safe, 
            anonymous space. Connect with others through the power of authentic expression.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link href="/browse">
              <Button className="btn-primary px-8 py-4 text-lg font-semibold group">
                Start Exploring
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </Link>
            
            <Link href="/submit">
              <Button 
                variant="outline"
                className="glass-card border-lavender/30 text-lavender hover:bg-lavender/10 px-8 py-4 text-lg font-semibold"
              >
                Share a Whisper
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={floatingVariants}
                animate="animate"
                className="glass-card p-6 text-center group"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-coral group-hover:text-lavender transition-colors" />
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-cool-gray/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cool-gray/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gradient-to-b from-coral to-lavender rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Why Choose</span>
              <br />
              <span className="text-white">Whispering Walls?</span>
            </h2>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto">
              Experience the freedom of anonymous expression in our supportive community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuresData.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-8 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <feature.icon className="w-12 h-12 text-coral group-hover:text-lavender transition-colors duration-300 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-cool-gray group-hover:text-white transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Real Stories</span>
              <br />
              <span className="text-white">Real Impact</span>
            </h2>
          </motion.div>

          <div className="relative glass-card p-12 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Star className="w-12 h-12 text-coral mx-auto mb-6 fill-current" />
                <p className="text-2xl md:text-3xl text-white font-medium italic mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <Badge 
                  className={`bg-${testimonials[currentTestimonial].color}/20 text-${testimonials[currentTestimonial].color} border-${testimonials[currentTestimonial].color}/30`}
                >
                  {testimonials[currentTestimonial].mood}
                </Badge>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="p-2 glass-card hover:bg-coral/10 transition-colors"
            >
              {isAutoplay ? <Volume2 className="w-5 h-5 text-coral" /> : <VolumeX className="w-5 h-5 text-cool-gray" />}
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentTestimonial(index);
                    setIsAutoplay(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-coral scale-125' 
                      : 'bg-cool-gray/30 hover:bg-cool-gray/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center neon-glow p-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="gradient-text">Ready to Share</span>
            <br />
            <span className="text-white">Your Story?</span>
          </h2>
          <p className="text-xl text-cool-gray mb-12 max-w-2xl mx-auto">
            Join thousands who have found comfort, connection, and healing through anonymous expression
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/submit">
              <Button className="btn-primary px-12 py-4 text-lg font-semibold">
                Write Your Whisper
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/browse">
              <Button 
                variant="outline"
                className="glass-card border-lavender/30 text-lavender hover:bg-lavender/10 px-12 py-4 text-lg font-semibold"
              >
                Explore Community
                <MessageCircle className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}