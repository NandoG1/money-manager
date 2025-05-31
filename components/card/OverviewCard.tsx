import { currencyFormatter } from "@/index";
import React from "react";

type Props = {
  title: string;
  icon: any;
  amount: number;
  color?: string;
};

function OverviewCard({ title, icon, amount, color }: Props) {
  const formattedAmount = currencyFormatter(amount);

  return (
    <div className="flex items-center gap-5 rounded-xl border border-white/10 px-6 py-7 shadow-lg backdrop-blur-sm bg-gradient-to-br from-black/80 to-black/60 hover:from-black/90 hover:to-black/70 transition-all duration-300 hover:shadow-xl group relative overflow-hidden">
     
      <div 
        className="absolute -inset-1 opacity-30 blur-xl rounded-full transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: `rgba(${color}, 0.2)` }}
      ></div>
      
      <div className="relative z-10 flex items-center gap-5 w-full">
        <div
          className="rounded-xl p-3.5 transition-all duration-300 group-hover:scale-110 shadow-lg"
          style={{
            color: `rgb(${color})`,
            backgroundColor: `rgba(${color}, 0.15)`,
            borderLeft: `2px solid rgb(${color})`,
          }}
        >
          {icon}
        </div>
        <div className="space-y-2 flex-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">
            {title}
          </h4>
          <p className="text-xl font-bold transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-white to-emerald-400">
            {formattedAmount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OverviewCard;
