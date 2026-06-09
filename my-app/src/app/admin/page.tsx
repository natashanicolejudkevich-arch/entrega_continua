"use client";

import React, { useState, useEffect } from 'react';
import { Match, MatchStatus } from '@/components/MatchCard';

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for new match
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [date, setDate] = useState('');
  const [league, setLeague] = useState('NBA');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (error) {
      console.error("Error fetching matches", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !date) return;

    const newMatch = {
      homeTeam,
      awayTeam,
      homeScore: null,
      awayScore: null,
      date: new Date(date).toISOString(),
      status: 'UPCOMING' as MatchStatus,
      league
    };

    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMatch)
    });

    if (res.ok) {
      setHomeTeam(''); setAwayTeam(''); setDate('');
      fetchMatches();
    }
  };

  const handleUpdateMatch = async (id: string, updates: Partial<Match>) => {
    const res = await fetch(`/api/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) fetchMatches();
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este partido?')) return;
    const res = await fetch(`/api/matches/${id}`, { method: 'DELETE' });
    if (res.ok) fetchMatches();
  };

  if (loading) return <div className="p-10 text-white">Cargando panel de administración...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        <header className="border-b border-zinc-800 pb-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-orange-500">Panel ABM - Básquet</h1>
              <p className="text-zinc-400 mt-2">Administra los partidos, actualiza resultados y elimina registros.</p>
            </div>
            <a 
              href="/" 
              className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold py-2 px-4 rounded-lg transition-all hover:-translate-y-0.5"
            >
              Volver a Inicio
            </a>
          </div>
        </header>

        {/* Formulario de Alta */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Partido</h2>
          <form onSubmit={handleAddMatch} className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-xs text-zinc-400">Liga</label>
              <input value={league} onChange={(e) => setLeague(e.target.value)} className="bg-zinc-800 border border-zinc-700 p-2 rounded text-sm" required />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-xs text-zinc-400">Equipo Local</label>
              <input value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} className="bg-zinc-800 border border-zinc-700 p-2 rounded text-sm" required />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-xs text-zinc-400">Equipo Visitante</label>
              <input value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} className="bg-zinc-800 border border-zinc-700 p-2 rounded text-sm" required />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-xs text-zinc-400">Fecha y Hora</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="bg-zinc-800 border border-zinc-700 p-2 rounded text-sm" required />
            </div>
            <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded transition-colors h-[42px]">
              Agregar
            </button>
          </form>
        </section>

        {/* Tabla de Partidos (Modificación y Baja) */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Partidos Registrados</h2>
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Local vs Visitante</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2">Puntajes (L - V)</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(match => (
                <tr key={match.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-3 px-2 text-zinc-500 text-sm">{match.id}</td>
                  <td className="py-3 px-2 font-semibold">
                    <span className="text-zinc-300">{match.homeTeam}</span> vs <span className="text-zinc-300">{match.awayTeam}</span>
                  </td>
                  <td className="py-3 px-2">
                    <select 
                      value={match.status} 
                      onChange={(e) => handleUpdateMatch(match.id, { status: e.target.value as MatchStatus })}
                      className="bg-zinc-800 border border-zinc-700 text-sm p-1 rounded"
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LIVE">LIVE</option>
                      <option value="FINISHED">FINISHED</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Local" 
                      value={match.homeScore ?? ''} 
                      onChange={(e) => handleUpdateMatch(match.id, { homeScore: e.target.value ? Number(e.target.value) : null })}
                      className="bg-zinc-800 border border-zinc-700 w-16 p-1 rounded text-center text-sm" 
                    />
                    <span>-</span>
                    <input 
                      type="number" 
                      placeholder="Visita" 
                      value={match.awayScore ?? ''} 
                      onChange={(e) => handleUpdateMatch(match.id, { awayScore: e.target.value ? Number(e.target.value) : null })}
                      className="bg-zinc-800 border border-zinc-700 w-16 p-1 rounded text-center text-sm" 
                    />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button 
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4 text-zinc-500">No hay partidos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
