import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchCard, { Match } from './MatchCard';

describe('MatchCard Component', () => {
  const baseMatch: Match = {
    id: '1',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeScore: null,
    awayScore: null,
    date: '2026-06-10T20:00:00Z',
    status: 'UPCOMING',
    league: 'NBA',
  };

  it('renders correctly with UPCOMING status', () => {
    render(<MatchCard match={baseMatch} />);
    
    // Check league
    expect(screen.getByText('NBA')).toBeInTheDocument();
    
    // Check teams
    expect(screen.getByText('Lakers')).toBeInTheDocument();
    expect(screen.getByText('Warriors')).toBeInTheDocument();
    
    // Check scores are missing (or show as '-')
    const hyphens = screen.getAllByText('-');
    expect(hyphens.length).toBeGreaterThanOrEqual(2);
  });

  it('renders correctly with LIVE status', () => {
    const liveMatch: Match = {
      ...baseMatch,
      status: 'LIVE',
      homeScore: 102,
      awayScore: 98,
    };
    render(<MatchCard match={liveMatch} />);
    
    expect(screen.getByText('EN VIVO')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
  });

  it('renders correctly with FINISHED status', () => {
    const finishedMatch: Match = {
      ...baseMatch,
      status: 'FINISHED',
      homeScore: 110,
      awayScore: 115, // Away team wins
    };
    render(<MatchCard match={finishedMatch} />);
    
    expect(screen.getByText('FINALIZADO')).toBeInTheDocument();
    expect(screen.getByText('110')).toBeInTheDocument();
    expect(screen.getByText('115')).toBeInTheDocument();
    
    // Check if away team score has winning classes
    const awayScoreElement = screen.getByText('115');
    expect(awayScoreElement).toHaveClass('text-orange-400');
    expect(awayScoreElement).toHaveClass('font-black');
    expect(awayScoreElement).toHaveClass('text-2xl');

    // Check if home team score has losing classes
    const homeScoreElement = screen.getByText('110');
    expect(homeScoreElement).toHaveClass('text-zinc-300');
    expect(homeScoreElement).toHaveClass('font-bold');
    expect(homeScoreElement).toHaveClass('text-xl');
  });
});
