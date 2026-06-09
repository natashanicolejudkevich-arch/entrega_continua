import MatchCard, { Match } from "@/components/MatchCard";
import Image from "next/image";

export default async function Home() {
  const apiUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/matches`
    : 'http://localhost:3000/api/matches';

  let matches: Match[] = [];
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (res.ok) {
      matches = await res.json();
    }
  } catch (error) {
    console.error("Error fetching matches:", error);
  }

  const finishedMatches = matches.filter(m => m.status === 'FINISHED');
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING');

  return (
    <div className="relative min-h-screen font-sans text-white selection:bg-orange-500/30">
      {/* NBA Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/nba_bg.png"
          alt="NBA Basketball Background"
          fill
          sizes="100vw"
          className="object-cover opacity-100"
          priority
        />
        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto flex flex-col gap-12 p-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-zinc-800/50 pb-8 mt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 drop-shadow-lg">
              Básquet Total
            </h1>
            <a 
              href="/admin" 
              className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.5)] hover:shadow-[0_0_25px_rgba(234,88,12,0.8)] hover:-translate-y-1"
            >
              Administrar Partidos
            </a>
          </div>
          <p className="text-zinc-300 text-xl font-medium tracking-wide">Tu plataforma de resultados y próximos partidos.</p>
        </header>

        {/* Resultados Recientes */}
        <section className="flex flex-col gap-6 backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-zinc-800/50 shadow-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
            Resultados Recientes
          </h2>
          {finishedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finishedMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 italic">No hay resultados recientes.</p>
          )}
        </section>

        {/* Próximos Partidos */}
        <section className="flex flex-col gap-6 backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-zinc-800/50 shadow-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-sm"></span>
            Próximos Partidos
          </h2>
          {upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 italic">No hay partidos próximos agendados.</p>
          )}
        </section>
      </main>
    </div>
  );
}
