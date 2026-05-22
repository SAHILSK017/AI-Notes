'use client';

export default function StatsCard({ title, value, icon: Icon, trend, color = "amber" }) {
  const colorMap = {
    amber: "from-primary to-primary/80 text-white dark:text-background shadow-lg",
    blue: "from-blue-500 to-blue-600 text-white shadow-lg",
    emerald: "from-emerald-500 to-emerald-600 text-white shadow-lg"
  };

  const textMap = {
    amber: "text-primary",
    blue: "text-blue-500",
    emerald: "text-emerald-500"
  };

  const bgMap = {
    amber: "bg-primary/10 border-primary/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20"
  };

  return (
    <div className="relative group p-8 bg-card/65 backdrop-blur-sm border border-border rounded-[2.5rem] hover:bg-card hover:border-primary/20 transition-all duration-500 shadow-sm overflow-hidden">
      {/* Decorative Glow */}
      <div className={`absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${color === 'amber' ? 'bg-primary' : color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${bgMap[color]} ${textMap[color]}`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-[0.3em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-foreground tracking-tighter group-hover:scale-[1.02] transition-transform origin-left duration-500">
          {value}
        </h3>
      </div>
    </div>
  );
}
