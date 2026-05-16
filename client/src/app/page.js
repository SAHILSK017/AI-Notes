import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Zap, Shield, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f3f1ea] selection:bg-[#d6a96d]/30 selection:text-[#d6a96d] overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[#d6a96d]/5 blur-[160px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-blue-500/5 blur-[140px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 h-24 px-10 flex items-center justify-between border-b border-[#2d3139]/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d6a96d] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(214,169,109,0.3)]">
            <Sparkles className="text-[#111315] w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AI Notes</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#a7afbd] hover:text-white transition-all px-6 py-2.5 rounded-xl">
            Sign In
          </Link>
          <Link href="/signup" className="bg-[#1b1f27] border border-[#2d3139] text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-[#232832] transition-all shadow-sm">
            Join Sanctuary
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d6a96d]/10 border border-[#d6a96d]/20 text-[#d6a96d] text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligence Augmented Workspace
        </div>
        
        <h1 className="text-6xl md:text-[5rem] font-black tracking-tighter leading-[1.05] text-white mb-8 max-w-4xl animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
          Capture thoughts before they <span className="text-[#d6a96d]">disappear.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[#a7afbd]/60 font-medium mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-top-12 duration-1000 delay-200">
          AI-powered notes designed for deep thinking, focused writing, and seamless organization. Your digital sanctuary for wisdom.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-top-16 duration-1000 delay-300">
          <Link href="/signup" className="group px-10 py-5 bg-[#d6a96d] text-[#111315] font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-[#e5b97d] transition-all shadow-[0_15px_30px_rgba(214,169,109,0.2)] hover:shadow-[0_20px_40px_rgba(214,169,109,0.3)] hover:-translate-y-1 flex items-center gap-3">
            Begin Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="px-10 py-5 bg-[#1b1f27] text-white font-black text-sm uppercase tracking-widest rounded-2xl border border-[#2d3139] hover:bg-[#232832] transition-all hover:border-[#d6a96d]/30 flex items-center gap-3">
            Return to Space
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 max-w-6xl w-full px-4">
          {[
            { icon: BookOpen, title: 'Deep Library', desc: 'A sophisticated archive for your most complex ideas.' },
            { icon: Zap, title: 'AI Synthesis', desc: 'Distill hours of reading into minutes of understanding.' },
            { icon: Shield, title: 'Total Privacy', desc: 'Your thoughts are encrypted and accessible only by you.' }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-[#16181d]/40 border border-[#2d3139]/50 rounded-[2.5rem] text-left hover:border-[#d6a96d]/30 transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 bg-[#1b1f27] border border-[#2d3139] rounded-2xl flex items-center justify-center mb-6 text-[#d6a96d] group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-[#a7afbd]/50 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer Credit */}
        <div className="mt-40 mb-12 flex flex-col items-center gap-4 opacity-30">
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#a7afbd] to-transparent" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a7afbd]">
            Crafted for the focused mind
          </p>
        </div>
      </main>
    </div>
  );
}
