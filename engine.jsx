/* ====================================================================
   Tournament engine + persistent store (localStorage)
   ==================================================================== */
const { useState, useEffect, useCallback, useMemo } = React;
const TVD = window.TV;

const STORE_KEY = 'cupatv:v2';

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { results: {}, ko: {}, schedule: {} };
}

function useTournament() {
  const [state, setState] = useState(loadState);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}

    if (window.firebaseReady && synced) {
      window.firebaseDb.ref('state').set(state).catch(e => console.log('Firebase sync failed:', e));
    }
  }, [state, synced]);

  useEffect(() => {
    if (!window.firebaseReady) {
      setSynced(true);
      return;
    }

    const ref = window.firebaseDb.ref('state');
    ref.on('value', snapshot => {
      const data = snapshot.val();
      if (data) setState(data);
      setSynced(true);
    });

    return () => {
      ref.off();
    };
  }, []);

  // Set / toggle winner of a group match. side = 'home' | 'away' | null
  const setWinner = useCallback((matchId, side) => {
    setState(s => {
      const results = { ...s.results };
      const cur = results[matchId] || {};
      if (side === null) {
        const { winner, ...rest } = cur;
        if (Object.keys(rest).length) results[matchId] = rest; else delete results[matchId];
      } else {
        results[matchId] = { ...cur, winner: side };
      }
      return { ...s, results };
    });
  }, []);

  const setScore = useCallback((matchId, score) => {
    setState(s => {
      const results = { ...s.results };
      const cur = results[matchId] || {};
      if (!score) {
        const { score: _, ...rest } = cur;
        if (Object.keys(rest).length) results[matchId] = rest; else delete results[matchId];
      } else {
        results[matchId] = { ...cur, score };
      }
      return { ...s, results };
    });
  }, []);

  // Advance a knockout match. side = 'a' | 'b' | null
  const setKO = useCallback((koId, side) => {
    setState(s => {
      const ko = { ...s.ko };
      if (side === null) delete ko[koId]; else ko[koId] = side;
      return { ...s, ko };
    });
  }, []);

  const setSchedule = useCallback((matchId, newDate) => {
    setState(s => {
      const schedule = { ...s.schedule };
      if (!newDate) delete schedule[matchId]; else schedule[matchId] = newDate;
      return { ...s, schedule };
    });
  }, []);

  const resetAll = useCallback(() => setState({ results: {}, ko: {}, schedule: {} }), []);

  return { state, setWinner, setScore, setKO, setSchedule, resetAll };
}

/* ---- Standings ---------------------------------------------------- */
// Returns ordered array of { team, P, W, L, pts } for a group.
function standingsFor(groupId, results) {
  const teams = Object.values(TVD.TEAMS).filter(t => t.group === groupId);
  const rows = {};
  teams.forEach(t => { rows[t.id] = { team: t, P: 0, W: 0, L: 0, pts: 0, h2h: {} }; });

  const groupMatches = TVD.MATCHES.filter(m => m.group === groupId);
  groupMatches.forEach(m => {
    const r = results[m.id];
    if (!r || !r.winner) return;
    const winId = r.winner === 'home' ? m.home : m.away;
    const loseId = r.winner === 'home' ? m.away : m.home;
    rows[winId].P++; rows[winId].W++; rows[winId].pts += 3;
    rows[loseId].P++; rows[loseId].L++;
    rows[winId].h2h[loseId] = 1;
  });

  const arr = Object.values(rows);
  arr.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.W !== a.W) return b.W - a.W;
    // head-to-head between two tied teams
    if (a.h2h[b.team.id]) return -1;
    if (b.h2h[a.team.id]) return 1;
    return a.team.country.localeCompare(b.team.country, 'ro');
  });
  return arr;
}

// Is the group fully decided (all matches have a winner)?
function groupComplete(groupId, results) {
  return TVD.MATCHES.filter(m => m.group === groupId)
    .every(m => results[m.id] && results[m.id].winner);
}

/* ---- Knockout resolution ----------------------------------------- */
// Resolve a slot reference {seed,grp} | {from} | {fromLoser} to a team id (or null).
function resolveSlot(slot, results, ko) {
  if (slot.grp) {
    const st = standingsFor(slot.grp, results);
    const row = st[slot.seed - 1];
    // only lock the team in once the group is fully complete
    if (!groupComplete(slot.grp, results)) return { teamId: null, label: `${slot.seed}${slot.grp}`, provisional: row ? row.team.id : null };
    return { teamId: row ? row.team.id : null, label: `${slot.seed}${slot.grp}` };
  }
  if (slot.from) {
    const tid = koWinner(slot.from, results, ko);
    return { teamId: tid, label: 'Câșt. ' + koBaseName(slot.from) };
  }
  if (slot.fromLoser) {
    const tid = koLoser(slot.fromLoser, results, ko);
    return { teamId: tid, label: 'Înv. ' + koBaseName(slot.fromLoser) };
  }
  return { teamId: null, label: '?' };
}

function koMatchById(id) {
  if (id === 'final') return TVD.KO.final;
  if (id === 'bronze') return TVD.KO.bronze;
  return [...TVD.KO.qf, ...TVD.KO.sf].find(m => m.id === id);
}
function koBaseName(id) {
  const map = { qf1: 'Sfert 1', qf2: 'Sfert 2', qf3: 'Sfert 3', qf4: 'Sfert 4', sf1: 'Semifinala 1', sf2: 'Semifinala 2' };
  return map[id] || id;
}

// Winner team id of a ko match (needs the chosen side + both slots resolvable)
function koWinner(koId, results, ko) {
  const m = koMatchById(koId);
  const side = ko[koId];
  if (!side) return null;
  const slot = side === 'a' ? m.a : m.b;
  return resolveSlot(slot, results, ko).teamId;
}
function koLoser(koId, results, ko) {
  const m = koMatchById(koId);
  const side = ko[koId];
  if (!side) return null;
  const slot = side === 'a' ? m.b : m.a;
  return resolveSlot(slot, results, ko).teamId;
}

window.ENGINE = { useTournament, standingsFor, groupComplete, resolveSlot, koMatchById, koWinner, koLoser };
