// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-black font-poppins">
      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-6xl mx-auto py-6 px-4 border-b border-gray-200">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          <img src="/PromptVaul.png" alt="" className="h-8 w-8" />
        </Link>

        <div className="flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-black">
            Features
          </a>
          <a href="#how" className="hover:text-black">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-black">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-700 hover:text-black transition"
          >
            Log in
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center py-28 px-4">
        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your <span className="text-blue-600">Prompt System</span> for Clarity.
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Designed for creators who think faster than they can type.
          PromptVault keeps every idea where it belongs — clear, searchable, and ready.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <Button>Start Free</Button>
          </Link>
          <a href="#features">
            <Button variant="secondary">Learn More</Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-6xl mx-auto py-24 px-4 grid md:grid-cols-3 gap-10 border-t border-gray-100"
      >
        {[
          {
            title: "Clarity First",
            desc: "A space built for focus — no noise, no distractions. Just your words and ideas.",
          },
          {
            title: "Fast By Design",
            desc: "Every action feels instant. Because tools should move at your speed, not the other way around.",
          },
          {
            title: "Organized, Always",
            desc: "Tag, search, and revisit your prompts effortlessly — structure that feels invisible.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-8 rounded-2xl border border-gray-200 hover:border-blue-600 transition-colors bg-white"
          >
            <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Product Preview */}
      <section className="max-w-6xl mx-auto py-24 px-4 text-center border-t border-gray-100">
        <h2 className="text-3xl font-bold mb-4">Everything. In one clean view.</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          From rough drafts to your best ideas — it’s all right here.
        </p>
        <div className="w-full h-[400px] rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
          <img
            src="/AppPreview.png"
            alt="PromptVault Dashboard Preview"
            className="rounded-xl shadow-sm border border-gray-200"
          />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how"
        className="max-w-5xl mx-auto py-24 px-4 border-t border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Add Your Prompts",
              desc: "Capture ideas instantly. No formatting, no setup.",
            },
            {
              step: "2",
              title: "Stay Structured",
              desc: "Use tags and filters to bring calm to your creative chaos.",
            },
            {
              step: "3",
              title: "Access Anywhere",
              desc: "Your vault, always in sync — desktop or mobile.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="p-6 border border-gray-200 rounded-2xl text-center"
            >
              <span className="text-blue-600 font-semibold text-sm">
                Step {s.step}
              </span>
              <h3 className="text-lg font-medium mt-2">{s.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="max-w-6xl mx-auto py-24 px-4 text-center border-t border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-4">Simple pricing. No surprises.</h2>
        <p className="text-gray-600 mb-12">Start free. Upgrade when you’re ready.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { tier: "Free", price: "$0", desc: "Perfect for getting started." },
            {
              tier: "Pro",
              price: "$9/mo",
              desc: "For creators who want performance and structure.",
            },
            {
              tier: "Team",
              price: "$29/mo",
              desc: "Built for teams that collaborate daily.",
            },
          ].map((p) => (
            <div
              key={p.tier}
              className="p-8 border border-gray-200 rounded-2xl bg-white"
            >
              <h3 className="text-xl font-semibold mb-2">{p.tier}</h3>
              <p className="text-4xl font-bold mb-4 text-blue-600">{p.price}</p>
              <p className="text-gray-600 text-sm mb-6">{p.desc}</p>
              <Link to="/signup">
                <Button>Choose {p.tier}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 text-center text-gray-500 text-sm bg-white">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/login" className="hover:text-black">
            Log in
          </Link>
          <Link to="/signup" className="hover:text-black">
            Sign up
          </Link>
          <a href="#features" className="hover:text-black">
            Features
          </a>
          <a href="#pricing" className="hover:text-black">
            Pricing
          </a>
        </div>
        © {new Date().getFullYear()} PromptVault — Built for clarity.
      </footer>
    </div>
  );
}