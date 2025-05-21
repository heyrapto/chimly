import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FloatingBackground } from "@/components/ui/floating-background";
import { Trophy, Briefcase, Scale, HelpCircle, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: "url('/assets/hero-bg.png')" }}
    >
      <div className="relative h-screen flex flex-col">
        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="relative w-24 h-12">
            <Image
              src="/assets/logo.png"
              alt="Chimly logo"
              fill
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                How To Use
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                FAQs
              </Link>
            </div>
            <Link
              href="/login"
              className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Navigation Dock */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#003326]/80 backdrop-blur-lg md:hidden border-t border-white/10 px-6 py-3 z-50">
            <div className="flex justify-between items-center">
              <Link href="#" className="flex flex-col items-center">
                <Trophy className="w-6 h-6 text-white/70" />
                <span className="text-xs mt-1 text-white/70">Achievements</span>
              </Link>
              <Link href="#" className="flex flex-col items-center">
                <Briefcase className="w-6 h-6 text-white/70" />
                <span className="text-xs mt-1 text-white/70">Our Work</span>
              </Link>
              <Link href="#" className="flex flex-col items-center">
                <Scale className="w-6 h-6 text-white/70" />
                <span className="text-xs mt-1 text-white/70">Compare</span>
              </Link>
              <Link href="#" className="flex flex-col items-center">
                <HelpCircle className="w-6 h-6 text-white/70" />
                <span className="text-xs mt-1 text-white/70">FAQs</span>
              </Link>
              <Link href="#" className="flex flex-col items-center">
                <DollarSign className="w-6 h-6 text-white/70" />
                <span className="text-xs mt-1 text-white/70">Pricing</span>
              </Link>
            </div>
          </div>
        </nav>

        <FloatingBackground />

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 -pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8">
            <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white tracking-tight font-medium px-4 py-2 lg:px-6 lg:py-3 rounded-full text-sm lg:text-base group">
              {/* Shimmer border */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent bg-[length:400%_100%] animate-[border-rotate_4s_linear_infinite]" />

              {/* Content */}
              <span className="inline-flex items-center gap-2 relative">
                <span className="text-emerald-400">✨</span>
                Simplify your workflow now
              </span>
            </div>
          </div>

          <h1 className="text-5xl text-white md:text-8xl font-bold leading-none tracking-tighter mb-6 max-w-4xl mx-auto">
            Multitask Like a Pro <br /> with{" "}
            <span className="relative inline-block">
              {/* Glow effect behind */}
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 blur-2xl opacity-40 animate-gradient-x"></span>

              {/* Text with clipped gradient and shimmer */}
              <span className="relative">
                <span className="font-fancy bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300 animate-gradient-x">
                  Chimly
                </span>
                <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent bg-[length:200%] animate-shimmer"></span>
              </span>
            </span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto tracking-tight leading-tight">
            Handle your daily tasks like a pro with <br />
            our loaded ai features
          </p>

          <Link
            href="/dashboard"
            className="inline-flex bg-white text-[#003326] px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            View Dashboard
          </Link>
        </main>

        {/* Achievements Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Our Features
              </h2>
              <p className="text-gray-400 text-lg">
                Wanna have a look at some of the features of our AI. Well we
                would love to <br />
                give you a tour
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project Card 1 */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors group">
                <div className="aspect-video mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/assets/project-1.png"
                    alt="Project showcase"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  10+ Projects
                </h3>
                <p className="text-gray-400">
                  Helping businesses across various industries achieve their
                  goals
                </p>
              </div>

              {/* Project Card 2 */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors group">
                <div className="aspect-video mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/assets/project-2.png"
                    alt="Web Design Process"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  5+ Projects
                </h3>
                <p className="text-gray-400">
                  A brief description of the web design process achievement.
                </p>
              </div>

              {/* Project Card 3 */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors group">
                <div className="aspect-video mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/assets/project-3.png"
                    alt="Savings Graph"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  20% Increase
                </h3>
                <p className="text-gray-400">
                  A brief description of the savings achievement.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
