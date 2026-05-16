'use client';

export default function StatsCard({ title, value, icon: Icon, trend, color = "amber" }) {
  const colorMap = {
    amber: "from-[#d6a96d] to-[#b88a4d] shadow-[0_10px_30px_rgba(214,169,109,0.2)]",
    blue: "from-[#3b82f6] to-[#2563eb] shadow-[0_10px_30px_rgba(59,130,246,0.2)]",
    emerald: "from-[#10b981] to-[#059669] shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
  };

  const textMap = {
    amber: "text-[#d6a96d]",
    blue: "text-[#3b82f6]",
    emerald: "text-[#10b981]"
  };

  const bgMap = {
    amber: "bg-[#d6a96d]/10 border-[#d6a96d]/20",
    blue: "bg-[#3b82f6]/10 border-[#3b82f6]/20",
    emerald: "bg-[#10b981]/10 border-[#10b981]/20"
  };

  return (
    <div className="relative group p-8 bg-[#111315]/40 backdrop-blur-sm border border-white/[0.03] rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 shadow-xl overflow-hidden">
      {/* Decorative Glow */}
      <div className={`absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${color === 'amber' ? 'bg-[#d6a96d]' : color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-[#111315] shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${bgMap[color]} ${textMap[color]}`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter group-hover:scale-[1.02] transition-transform origin-left duration-500">
          {value}
        </h3>
      </div>
    </div>
  );
}
