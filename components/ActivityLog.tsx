
import React from 'react';
import { ActivityEntry } from '../types';

interface ActivityLogProps {
  activities: ActivityEntry[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getIcon = (type: ActivityEntry['type']) => {
    switch (type) {
      case 'npc_rescued': return 'person_add';
      case 'reward_claimed': return 'redeem';
      case 'decoration_placed': return 'home_pin';
      case 'battle_victory': return 'military_tech';
      case 'quest_complete': return 'task_alt';
      case 'level_up': return 'trending_up';
      default: return 'history';
    }
  };

  const sorted = [...activities].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-background-dark/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-6">
      <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Chronicle History</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {sorted.map((log) => (
          <div key={log.id} className="flex gap-3 items-start animate-fadeIn">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-sm">{getIcon(log.type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/80 leading-snug font-medium line-clamp-2">{log.description}</p>
              <p className="text-[9px] text-white/30 uppercase font-black tabular-nums mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center py-4 text-[10px] text-white/20 italic uppercase tracking-widest">No activities recorded</p>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
