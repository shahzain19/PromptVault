import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Zap,
  Tags,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Target,
      title: "Clarity",
      desc: "Distraction-free interface for pure focus.",
    },
    {
      icon: Zap,
      title: "Velocity",
      desc: "Engineered for speed and seamless flow.",
    },
    {
      icon: Tags,
      title: "Order",
      desc: "Precise organization for your prompt library.",
    },
    {
      icon: ShieldCheck,
      title: "Security",
      desc: "JWT-powered protection for your creative assets.",
    },
    {
      icon: Smartphone,
      title: "Adaptive",
      desc: "Perfectly fluid across every single device.",
    },
    {
      icon: RefreshCw,
      title: "Sync",
      desc: "Real-time consistency, everywhere you go.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold tracking-tighter">PROMPTVAULT</Link>

          <div className="hidden md:flex gap-10 text-sm font-medium tracking-tight">
            <a href="#features" className="hover:text-gray-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-gray-400 transition-colors">How</a>
            <a href="#demo" className="hover:text-gray-400 transition-colors">Demo</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-medium hover:text-gray-400 transition-colors">Login</Link>
            <Link
              to="/signup"
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Get Started
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-gray-100 p-6 flex flex-col gap-4 text-center"
          >
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Features</a>
            <a href="#how" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">How</a>
            <a href="#demo" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Demo</a>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Login</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="space-y-6"
        >
          <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter leading-[0.9] max-w-4xl">
            Store your <br />
            <span className="text-gray-400">mastery in order.</span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto font-medium tracking-tight">
            The minimal prompt management system for creators who demand clarity.
          </p>
          <div className="pt-4">
            <Link
              to="/signup"
              className="group bg-black text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 mx-auto transition-all hover:pr-10 active:scale-[0.98]"
            >
              Start Building <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.2, 0, 0, 1] }}
          className="mt-20 w-full relative"
        >
          <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent -z-10" />
          <div className="aspect-[16/9] w-full max-w-6xl mx-auto bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
            <img
              src="/AppPreview.png"
              alt="PromptVault Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid gap-px bg-gray-100 border border-gray-100 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-3xl">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-12 bg-white flex flex-col items-start gap-4 group"
              >
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <Icon size={24} />
                </div>
                <h4 className="text-xl font-semibold tracking-tight">{f.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-5xl font-semibold tracking-tight"
          >
            Design that disappears, <br />
            <span className="text-gray-600">to let you work.</span>
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="space-y-4">
              <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">01. Capture</span>
              <p className="text-gray-400">Save prompts as fast as you think. No friction, no noise.</p>
            </div>
            <div className="space-y-4">
              <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">02. Organize</span>
              <p className="text-gray-400">Tags and search refined to the essential. Find anything.</p>
            </div>
            <div className="space-y-4">
              <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">03. Secure</span>
              <p className="text-gray-400">Your data is yours. Protected by industry-standard JWT.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section id="demo" className="py-32 px-6 max-w-5xl mx-auto text-center space-y-12">
        <h3 className="text-3xl font-semibold tracking-tight">The Experience</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-xl"
        >
          <video
            src="/demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-gray-50">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Ready for clarity?</h2>
          <Link
            to="/signup"
            className="inline-block bg-black text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 px-6 border-t border-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-sm font-semibold tracking-tighter">PROMPTVAULT</span>
          <div className="flex gap-8 text-sm text-gray-400 font-medium">
            <a href="#" className="hover:text-black transition-colors">Twitter</a>
            <a href="#" className="hover:text-black transition-colors">GitHub</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
          <p className="text-xs text-gray-300">© 2026 PromptVault. Massive minimal.</p>
        </div>
      </footer>
    </div>
  );
}
