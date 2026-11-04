import React from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

interface AndroidStatusBarProps {
  time?: string;
  battery?: string;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  time = '10:39',
  battery = '84%'
}) => {
  return (
    <div className="h-6 w-full bg-[#0b0e14]/90 backdrop-blur-md px-4 flex items-center justify-between text-xs text-slate-300 select-none z-50">
      <div className="font-semibold tracking-tight text-[11px]">{time}</div>
      <div className="flex items-center gap-2 text-[10px]">
        <span className="font-medium px-1 bg-slate-800 text-[9px] rounded text-slate-400">Vo LTE 1</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span>{battery}</span>
          <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
        </div>
      </div>
    </div>
  );
};
