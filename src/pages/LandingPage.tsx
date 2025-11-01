import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Tags,
  ShieldCheck,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const features = [
    {
      icon: Target,
      title: "Clarity First",
      desc: "A distraction-free interface that helps you stay focused on creating.",
    },
    {
      icon: Zap,
      title: "Fast by Design",
      desc: "Instant search and real-time updates for seamless flow.",
    },
    {
      icon: Tags,
      title: "Smart Organization",
      desc: "Tag, search, and filter your prompts effortlessly.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Authentication",
      desc: "Account protection with email verification and Supabase auth.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      desc: "Built to look and feel amazing on every device.",
    },
    {
      icon: RefreshCw,
      title: "Real-time Sync",
      desc: "Stay up-to-date across all devices with instant updates.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 -z-10" />

      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <h1 className="font-bold text-xl tracking-tight">PromptVault</h1>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-gray-600">
            Features
          </a>
          <a href="#how" className="hover:text-gray-600">
            How It Works
          </a>
          <a href="#stack" className="hover:text-gray-600">
            Tech Stack
          </a>
          <a href="#demo" className="hover:text-gray-600">
            Demo
          </a>
        </nav>
        <Link
          to="/login"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-all"
        >
          Launch App
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center text-center mt-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight mb-6"
        >
          Your <span className="text-blue-600">Prompt System</span> for Clarity
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 text-lg max-w-2xl mb-8"
        >
          Designed for creators who think faster than they can type. Organize,
          manage, and access your prompts effortlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 active:scale-[0.97]"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <a
            href="#demo"
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all active:scale-[0.97]"
          >
            Watch Demo
          </a>
        </motion.div>

        <motion.img
          src="/AppPreview.png"
          alt="PromptVault Preview"
          className="mt-16 w-full max-w-4xl rounded-2xl shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        />
      </main>

      {/* Features */}
      <motion.section
        id="features"
        className="py-24 px-6 bg-gray-50 mt-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Built for Focused Creators</h3>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <Icon className="w-6 h-6 mb-3 text-blue-600" />
                  <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how"
        className="py-24 bg-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">How It Works</h3>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add Your Prompts",
                desc: "Store and organize your AI prompts instantly.",
              },
              {
                step: "2",
                title: "Tag & Search",
                desc: "Easily find what you need with smart filtering.",
              },
              {
                step: "3",
                title: "Access Anywhere",
                desc: "Everything syncs in real-time across your devices.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold mb-4 mx-auto">
                  {s.step}
                </div>
                <h4 className="font-semibold mb-2">{s.title}</h4>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        id="stack"
        className="py-24 px-6 bg-gray-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10">Tech That Powers PromptVault</h3>
          <div className="flex flex-wrap justify-center gap-4 text-gray-700">
            {[
              "React 19",
              "TypeScript",
              "Vite",
              "Tailwind CSS",
              "Supabase",
              "Framer Motion",
              "Lucide Icons",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Demo */}
      <motion.section
        id="demo"
        className="py-24 bg-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10">See PromptVault in Action</h3>
          <video
            src="/demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-xl shadow-lg border border-gray-200"
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>
          Built by <span className="text-black font-medium">Cranze</span> •{" "}
          <Sparkles className="inline w-4 h-4 text-yellow-500" /> For creators
          who move fast.
        </p>
      </footer>
    </div>
  );
}
