import React from 'react';

const TabButton = ({ active, onClick, icon, label, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3.5 py-1.5 rounded-sm 
        font-mono text-[10px] font-semibold tracking-widest uppercase 
        transition-all duration-200 border border-transparent outline-none relative whitespace-nowrap
        ${active 
          ? 'text-[#7c6ff7] bg-[#7c6ff7]/10 border-[#7c6ff7]/20' 
          : 'text-white/30 hover:text-white/50 hover:bg-white/5'}
      `}
    >
      <span className={active ? 'text-[#7c6ff7]' : 'text-current opacity-70'}>
        {icon}
      </span>
      {label}
      {active && (
        <span className="absolute -bottom-[7px] left-3.5 right-3.5 h-[1px] bg-[#7c6ff7]/70 rounded-full" />
      )}
      {badge && !active && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#7c6ff7] animate-pulse" />
      )}
    </button>
  );
};

export default TabButton;
