/* ====================================================================
   Presentational components: standings, match cards, group cards
   TEAMS, GROUPS, MATCHES are already global (declared in data.js).
   ==================================================================== */

function Players({ team }) {
  return <div className="players">{team.p[0]} · {team.p[1]}</div>;
}

/* A clickable team row inside a match card. */
function TeamRow({ team, side, winnerSide, isDraw, decided, color, onPick, locked }) {
  const isWin = !isDraw && winnerSide === side;
  const isLose = decided && !isWin && !isDraw;
  const cls = 'mc-team' + (isWin ? ' win' : '') + (isLose ? ' lose' : '') + (isDraw ? ' draw' : '') + (locked ? ' locked' : '');
  return (
    <button
      className={cls}
      style={isWin ? { '--win': color } : isDraw ? { '--win': color } : undefined}
      onClick={locked ? undefined : () => onPick(isWin || isDraw ? null : side)}
      disabled={locked}
      title={locked ? 'Meci jucat — nu poate fi modificat' : 'Marchează câștigătorul'}
    >
      <span className="mc-flag">{team.flag}</span>
      <span className="mc-tn">
        <span className="mc-country">{team.country}</span>
        <span className="mc-players">{team.p[0]} · {team.p[1]}</span>
      </span>
      <span className="mc-check" aria-hidden="true">{isDraw ? '½' : '✓'}</span>
    </button>
  );
}

function isMatchLocked(match, schedule) {
  const dateStr = (schedule && schedule[match.id]) || match.date;
  const matchDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return matchDate < today;
}

/* Editable match card. */
function MatchCard({ match, store, showDate }) {
  const { state, setWinner, setScore } = store;
  const r = state.results[match.id] || {};
  const home = TEAMS[match.home], away = TEAMS[match.away];
  const color = GROUPS[match.group].color;
  const isDraw = r.winner === 'draw';
  const decided = !!r.winner;
  const locked = isMatchLocked(match, state.schedule);

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };
  const actualDate = (state.schedule && state.schedule[match.id]) || match.date;
  const dateLabel = getDateLabel(actualDate);

  return (
    <div className={'matchcard' + (decided ? ' done' : '') + (locked ? ' locked' : '')}>
      <div className="mc-head">
        <span className="mc-grp" style={{ '--c': color }}>Gr. {match.group}</span>
        {showDate && <span className="mc-date">{dateLabel}{match.time ? ' · ' + match.time : ''}</span>}
        {!showDate && match.time && <span className="mc-date">{match.time}</span>}
        {locked
          ? <span className="mc-status locked">🔒 Jucat</span>
          : decided
            ? <span className="mc-status done">Finalizat</span>
            : <span className="mc-status">De jucat</span>}
      </div>

      <div className="mc-body">
        <TeamRow team={home} side="home" winnerSide={r.winner} isDraw={isDraw} decided={decided} color={color}
                 onPick={(s) => setWinner(match.id, s)} locked={locked} />
        <div className="mc-vs-col">
          <div className="mc-vs">vs</div>
          {!locked && (
            <button
              className={'mc-draw' + (isDraw ? ' active' : '')}
              onClick={() => setWinner(match.id, isDraw ? null : 'draw')}
              title="Marchează egal"
            >Egal</button>
          )}
          {locked && isDraw && <div className="mc-draw-label">Egal</div>}
        </div>
        <TeamRow team={away} side="away" winnerSide={r.winner} isDraw={isDraw} decided={decided} color={color}
                 onPick={(s) => setWinner(match.id, s)} locked={locked} />
      </div>

      <div className="mc-foot">
        <input
          className="mc-score"
          type="text"
          inputMode="text"
          placeholder="scor (opțional)"
          value={r.score || ''}
          onChange={locked ? undefined : (e) => setScore(match.id, e.target.value)}
          disabled={locked}
        />
        {decided && !locked && (
          <button className="mc-reset" onClick={() => setWinner(match.id, null)}>↺ resetează</button>
        )}
      </div>
    </div>
  );
}

/* 2x2 flag tile used in group card header (callback to the reference art). */
function FlagTile({ groupId }) {
  const teams = Object.values(TEAMS).filter(t => t.group === groupId);
  return (
    <div className="flagtile" style={{ '--c': GROUPS[groupId].color }}>
      {teams.map(t => <span key={t.id} className="flagtile-f">{t.flag}</span>)}
    </div>
  );
}

/* Standings table for one group. */
function Standings({ groupId, store }) {
  const rows = window.ENGINE.standingsFor(groupId, store.state.results);
  const complete = window.ENGINE.groupComplete(groupId, store.state.results);
  const color = GROUPS[groupId].color;
  return (
    <table className="standings">
      <thead>
        <tr>
          <th className="st-pos">#</th>
          <th className="st-team">Echipă</th>
          <th>J</th><th>V</th><th>E</th><th>Î</th><th className="st-pts">Pct</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const qual = i < 2;
          return (
            <tr key={row.team.id} className={qual ? 'qual' : ''} style={qual ? { '--c': color } : undefined}>
              <td className="st-pos">{i + 1}</td>
              <td className="st-team">
                <span className="st-flag">{row.team.flag}</span>
                <span className="st-name">
                  <span className="st-country">{row.team.country}</span>
                  <span className="st-players">{row.team.p[0]} · {row.team.p[1]}</span>
                </span>
                {qual && complete && <span className="st-badge" style={{ '--c': color }}>calificat</span>}
              </td>
              <td>{row.P}</td>
              <td className="st-w">{row.W}</td>
              <td>{row.D}</td>
              <td>{row.L}</td>
              <td className="st-pts">{row.pts}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* Full group card: header + standings + matches. */
function GroupCard({ groupId, store }) {
  const g = GROUPS[groupId];
  const matches = window.TV.MATCHES.filter(m => m.group === groupId);
  const done = matches.filter(m => (store.state.results[m.id] || {}).winner).length;
  return (
    <section className="groupcard" style={{ '--c': g.color, '--glow': g.glow }}>
      <header className="gc-head">
        <FlagTile groupId={groupId} />
        <div className="gc-title">
          <h2>{g.name}</h2>
          <span className="gc-prog">{done}/{matches.length} meciuri</span>
        </div>
      </header>
      <Standings groupId={groupId} store={store} />
      <div className="gc-matches">
        <div className="gc-matches-label">Meciuri</div>
        {matches.map(m => <MatchCard key={m.id} match={m} store={store} showDate={true} />)}
      </div>
    </section>
  );
}

Object.assign(window, { Players, TeamRow, MatchCard, FlagTile, Standings, GroupCard });
