import matches from './matches.json';

describe('matches.json data validation', () => {
  it('all FINISHED matches must have a homeScore and awayScore', () => {
    matches.forEach((match) => {
      if (match.status === 'FINISHED') {
        expect(match.homeScore).not.toBeNull();
        expect(match.awayScore).not.toBeNull();
        expect(typeof match.homeScore).toBe('number');
        expect(typeof match.awayScore).toBe('number');
      }
    });
  });
});
