/* ====================================================================
   App shell: header, tabs (Grupe / Calendar / Bracket), views
   ==================================================================== */
const { useState: useStateA } = React;

function Calendar({ store }) {
  const dates = [];
  const byDate = {};
  window.TV.MATCHES.forEach(m => {
    const actualDate = store.state.schedule[m.id] || m.date;
    if (!byDate[actualDate]) { byDate[actualDate] = { items: [] }; dates.push(actualDate); }
    byDate[actualDate].items.push(m);
  });
  dates.sort();

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    const day = days[date.getDay()];
    const dayNum = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${dayNum} ${month}`;
  };

  return (
    <div className="calendar">
      {dates.map(d => (
        <section className="cal-day" key={d}>
          <div className="cal-daylabel">
            <span className="cal-dot" />{getDateLabel(d)}
            <span className="cal-count">{byDate[d].items.length} {byDate[d].items.length === 1 ? 'meci' : 'meciuri'}</span>
          </div>
          <div className="cal-grid">
            {byDate[d].items.map(m => <MatchCard key={m.id} match={m} store={store} showDate={false} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function Groups({ store }) {
  return (
    <div className="groups-grid">
      {window.TV.GROUP_ORDER.map(g => <GroupCard key={g} groupId={g} store={store} />)}
    </div>
  );
}

function Reschedule({ store }) {
  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    const day = days[date.getDay()];
    const dayNum = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${dayNum} ${month}`;
  };

  const isLocked = (m) => {
    const dateStr = store.state.schedule[m.id] || m.date;
    const matchDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchDate < today;
  };

  return (
    <div className="view">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--txt)' }}>Reprogramare Meciuri</h2>
        <table className="reschedule-table">
          <thead>
            <tr>
              <th>Meci</th>
              <th style={{ width: '250px' }}>Data Meci</th>
              <th style={{ width: '200px' }}>Alege Data</th>
            </tr>
          </thead>
          <tbody>
            {window.TV.MATCHES.map(m => {
              const home = TEAMS[m.home];
              const away = TEAMS[m.away];
              const actualDate = store.state.schedule[m.id] || m.date;
              const locked = isLocked(m);
              return (
                <tr key={m.id} className={locked ? 'rs-locked' : ''}>
                  <td>
                    <div className="rs-match">
                      <span className="rs-flag">{home.flag}</span>
                      <div className="rs-teams">
                        <div className="rs-team">{home.country}</div>
                        <div className="rs-vs">vs</div>
                        <div className="rs-team">{away.country}</div>
                      </div>
                      <span className="rs-flag">{away.flag}</span>
                    </div>
                  </td>
                  <td>
                    <div className="rs-date-label">
                      {getDateLabel(actualDate)}
                      {locked && <span className="rs-lock-badge">🔒</span>}
                    </div>
                  </td>
                  <td>
                    <input
                      className="rs-date-input"
                      type="date"
                      value={actualDate}
                      onChange={locked ? undefined : (e) => store.setSchedule(m.id, e.target.value)}
                      disabled={locked}
                      title={locked ? 'Meci jucat — data nu poate fi modificată' : undefined}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KOSchedule({ store }) {
  const getDateLabel = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const isLocked = (koId) => {
    const sched = store.state.schedule[koId];
    if (!sched) return false;
    const matchDate = new Date(sched + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchDate < today;
  };

  const getTeamLabel = (slot) => {
    const res = window.ENGINE.resolveSlot(slot, store.state.results, store.state.ko);
    if (res.teamId) {
      const t = TEAMS[res.teamId];
      return <span>{t.flag} {t.country}</span>;
    }
    if (res.provisional) {
      const t = TEAMS[res.provisional];
      return <span style={{ opacity: .5 }}>{t.flag} {t.country}*</span>;
    }
    return <span style={{ opacity: .4 }}>{res.label}</span>;
  };

  const KO_LABELS = {
    qf1: 'Sfert 1', qf2: 'Sfert 2', qf3: 'Sfert 3', qf4: 'Sfert 4',
    sf1: 'Semifinala 1', sf2: 'Semifinala 2',
    final: 'Finala', bronze: 'Finala Mică',
  };

  const allKO = [
    ...window.TV.KO.qf,
    ...window.TV.KO.sf,
    window.TV.KO.final,
    window.TV.KO.bronze,
  ];

  return (
    <div className="view">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--txt)' }}>Programare Faza Eliminatorie</h2>
        <table className="reschedule-table">
          <thead>
            <tr>
              <th>Meci</th>
              <th style={{ width: '220px' }}>Data</th>
              <th style={{ width: '160px' }}>Alege Data</th>
              <th style={{ width: '130px' }}>Oră</th>
            </tr>
          </thead>
          <tbody>
            {allKO.map(m => {
              const schedDate = store.state.schedule[m.id] || '';
              const schedTime = store.state.schedule[m.id + '_time'] || '';
              const locked = isLocked(m.id);
              return (
                <tr key={m.id} className={locked ? 'rs-locked' : ''}>
                  <td>
                    <div className="rs-match kos-match">
                      <span className="kos-label">{KO_LABELS[m.id]}</span>
                      <div className="kos-teams">
                        <div className="kos-team">{getTeamLabel(m.a)}</div>
                        <div className="rs-vs">vs</div>
                        <div className="kos-team">{getTeamLabel(m.b)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="rs-date-label">
                      {schedDate ? getDateLabel(schedDate) : <span style={{ opacity: .4 }}>Neprogramat</span>}
                      {locked && <span className="rs-lock-badge">🔒</span>}
                      {schedTime && !locked && <span style={{ color: 'var(--mut)', marginLeft: '6px' }}>{schedTime}</span>}
                    </div>
                  </td>
                  <td>
                    <input
                      className="rs-date-input"
                      type="date"
                      value={schedDate}
                      onChange={locked ? undefined : (e) => store.setSchedule(m.id, e.target.value)}
                      disabled={locked}
                      title={locked ? 'Meci jucat — data nu poate fi modificată' : undefined}
                    />
                  </td>
                  <td>
                    <input
                      className="rs-time-input"
                      type="time"
                      value={schedTime}
                      onChange={locked ? undefined : (e) => store.setSchedule(m.id + '_time', e.target.value)}
                      disabled={locked || !schedDate}
                      title={!schedDate ? 'Alege mai întâi data' : locked ? 'Meci jucat' : undefined}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const store = window.ENGINE.useTournament();
  const [tab, setTab] = useStateA('grupe');

  const total = window.TV.MATCHES.length;
  const done = window.TV.MATCHES.filter(m => (store.state.results[m.id] || {}).winner).length;

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">⚽</span>
          <span className="brand-name">FIFA Cup 2026</span>
        </div>
        <div className="topbar-meta">
          <span className="meta-prog">{done}<span>/{total}</span> meciuri jucate</span>
        </div>
      </header>

      <div className="hero">
        <div className="hero-kicker">10 – 25 Iunie 2026 · 16 echipe · 4 grupe</div>
        <h1 className="hero-title">FIFA CUP<br /><span>2026</span></h1>
        <div className="hero-sub">Turneul perechilor · grupe + faza eliminatorie</div>
      </div>

      <nav className="tabs">
        <button className={tab === 'grupe' ? 'on' : ''} onClick={() => setTab('grupe')}>Grupe</button>
        <button className={tab === 'calendar' ? 'on' : ''} onClick={() => setTab('calendar')}>Calendar</button>
        <button className={tab === 'bracket' ? 'on' : ''} onClick={() => setTab('bracket')}>Faza eliminatorie</button>
        <button className={tab === 'reschedule' ? 'on' : ''} onClick={() => setTab('reschedule')}>Reprogramare</button>
        <button className={tab === 'koschedule' ? 'on' : ''} onClick={() => setTab('koschedule')}>Programare Sferturi</button>
      </nav>

      <main>
        {tab === 'grupe' && <div className="view"><Groups store={store} /></div>}
        {tab === 'calendar' && <Calendar store={store} />}
        {tab === 'bracket' && <div className="view"><Bracket store={store} /></div>}
        {tab === 'reschedule' && <Reschedule store={store} />}
        {tab === 'koschedule' && <KOSchedule store={store} />}
      </main>

      <footer className="foot">
        <div className="foot-26">FIFA CUP <b>26</b></div>
        <div className="foot-note">Marchează câștigătorul fiecărui meci — clasamentele și bracketul se completează automat.</div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
