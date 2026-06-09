/* ====================================================================
   App shell: header, tabs (Grupe / Calendar / Bracket), views
   ==================================================================== */
const { useState: useStateA } = React;

function Calendar({ store }) {
  const dates = [];
  const byDate = {};
  window.TV.MATCHES.forEach(m => {
    if (!byDate[m.date]) { byDate[m.date] = { label: m.label, items: [] }; dates.push(m.date); }
    byDate[m.date].items.push(m);
  });
  return (
    <div className="calendar">
      {dates.map(d => (
        <section className="cal-day" key={d}>
          <div className="cal-daylabel">
            <span className="cal-dot" />{byDate[d].label}
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

function App() {
  const store = window.ENGINE.useTournament();
  const [tab, setTab] = useStateA('grupe');

  const total = window.TV.MATCHES.length;
  const done = window.TV.MATCHES.filter(m => (store.state.results[m.id] || {}).winner).length;

  const onReset = () => {
    if (window.confirm('Resetezi toate rezultatele și bracketul? Acțiunea nu poate fi anulată.')) store.resetAll();
  };

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">TV</span>
          <span className="brand-name">TradeVille</span>
        </div>
        <div className="topbar-meta">
          <span className="meta-prog">{done}<span>/{total}</span> meciuri jucate</span>
          <button className="btn-reset" onClick={onReset} title="Resetează tot">Resetează</button>
        </div>
      </header>

      <div className="hero">
        <div className="hero-kicker">10 – 25 Iunie 2026 · 16 echipe · 4 grupe</div>
        <h1 className="hero-title">FIFA CUP<br /><span>TRADEVILLE</span></h1>
        <div className="hero-sub">Turneul perechilor · grupe + faza eliminatorie</div>
      </div>

      <nav className="tabs">
        <button className={tab === 'grupe' ? 'on' : ''} onClick={() => setTab('grupe')}>Grupe</button>
        <button className={tab === 'calendar' ? 'on' : ''} onClick={() => setTab('calendar')}>Calendar</button>
        <button className={tab === 'bracket' ? 'on' : ''} onClick={() => setTab('bracket')}>Faza eliminatorie</button>
      </nav>

      <main className="view">
        {tab === 'grupe' && <Groups store={store} />}
        {tab === 'calendar' && <Calendar store={store} />}
        {tab === 'bracket' && <Bracket store={store} />}
      </main>

      <footer className="foot">
        <div className="foot-26">FIFA CUP <b>26</b></div>
        <div className="foot-note">Marchează câștigătorul fiecărui meci — clasamentele și bracketul se completează automat. Progresul se salvează în acest browser.</div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
