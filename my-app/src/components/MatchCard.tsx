import React from 'react';

export type MatchStatus = 'FINISHED' | 'UPCOMING' | 'LIVE';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  status: MatchStatus;
  league: string;
}

export default function MatchCard({ match }: { match: Match }) {
  const dateObj = new Date(match.date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl hover:border-orange-500/50 hover:bg-zinc-800/80 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-center text-xs font-semibold tracking-wider text-zinc-400">
        <span className="uppercase text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">{match.league}</span>
        <span className={match.status === 'LIVE' ? 'text-red-500 animate-pulse flex items-center gap-1' : 'bg-zinc-800 px-2 py-1 rounded-md'}>
          {match.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
          {match.status === 'FINISHED' ? 'FINALIZADO' : match.status === 'LIVE' ? 'EN VIVO' : `${formattedDate} - ${formattedTime}`}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 mt-2">
        {/* Home Team */}
        <div className="flex justify-between items-center text-xl font-bold text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs border border-zinc-600">
              {match.homeTeam.substring(0, 3).toUpperCase()}
            </div>
            <span>{match.homeTeam}</span>
          </div>
          <span className={match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore ? 'text-orange-400 font-black text-2xl' : 'text-zinc-300 font-bold text-xl'}>
            {match.homeScore ?? '-'}
          </span>
        </div>
        
        {/* Away Team */}
        <div className="flex justify-between items-center text-xl font-bold text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs border border-zinc-600">
              {match.awayTeam.substring(0, 3).toUpperCase()}
            </div>
            <span>{match.awayTeam}</span>
          </div>
          <span className={match.awayScore !== null && match.homeScore !== null && match.awayScore > match.homeScore ? 'text-orange-400 font-black text-2xl' : 'text-zinc-300 font-bold text-xl'}>
            {match.awayScore ?? '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
