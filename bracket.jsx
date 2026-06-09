/* ====================================================================
   Knockout bracket: QF -> SF -> Final + Bronze, trophy & champion
   ==================================================================== */
const E = window.ENGINE;
const KOD = window.TV.KO;

function shortCountry(c) { return c; }

/* One pickable slot inside a KO match. */
function KOSlot({ slot, store, koId, side, chosen }) {
  const res = E.resolveSlot(slot, store.state.results, store.state.ko);
  const team = res.teamId ? window.TV.TEAMS[res.teamId] : null;
  const isWin = chosen === side && !!team;
  const isLose = chosen && chosen !== side && !!team;
  const provisional = !team && res.provisional ? window.TV.TEAMS[res.provisional] : null;

  const cls = 'ko-slot' + (isWin ? ' win' : '') + (isLose ? ' lose' : '') + (!team ? ' empty' : '');
  return (
    <button
      className={cls}
      disabled={!team}
      onClick={() => team && store.setKO(koId, isWin ? null : side)}
      title={team ? 'Marchează câștigătorul' : 'Se completează din clasament'}
    >
      {team ? (
        <>
          <span className="ko-flag">{team.flag}</span>
          <span className="ko-tn">
            <span className="ko-country">{team.country}</span>
            <span className="ko-players">{team.p[0]} · {team.p[1]}</span>
          </span>
          <span className="ko-check">✓</span>
        </>
      ) : (
        <>
          <span className="ko-seed">{res.label}</span>
          {provisional && <span className="ko-prov">{provisional.flag} {provisional.country} · provizoriu</span>}
        </>
      )}
    </button>
  );
}

function KOCard({ koId, store, label }) {
  const m = E.koMatchById(koId);
  const chosen = store.state.ko[koId];
  return (
    <div className="kocard">
      {label && <div className="ko-label">{label}</div>}
      <div className="ko-pair">
        <KOSlot slot={m.a} side="a" koId={koId} store={store} chosen={chosen} />
        <div className="ko-mid"><span>vs</span></div>
        <KOSlot slot={m.b} side="b" koId={koId} store={store} chosen={chosen} />
      </div>
    </div>
  );
}

function Trophy({ store }) {
  const champId = E.koWinner('final', store.state.results, store.state.ko);
  const champ = champId ? window.TV.TEAMS[champId] : null;
  return (
    <div className="trophy-wrap">
      <div className="trophy-glow" />
      <div className="trophy">🏆</div>
      <div className="champ-label">Campion</div>
      {champ ? (
        <div className="champ">
          <span className="champ-flag">{champ.flag}</span>
          <span className="champ-country">{champ.country}</span>
          <span className="champ-players">{champ.p[0]} · {champ.p[1]}</span>
        </div>
      ) : (
        <div className="champ champ-tbd">FIFA Cup TradeVille</div>
      )}
    </div>
  );
}

function Bracket({ store }) {
  return (
    <div className="bracket-scroll">
      <div className="bracket">
        {/* LEFT QF */}
        <div className="bk-col qf-col">
          <KOCard koId="qf1" store={store} label="Sfert 1" />
          <KOCard koId="qf2" store={store} label="Sfert 2" />
        </div>
        <div className="bk-conn left"><div className="bracket-shape" /></div>

        {/* LEFT SF */}
        <div className="bk-col sf-col">
          <KOCard koId="sf1" store={store} label="Semifinala 1" />
        </div>
        <div className="bk-conn left flat"><div className="line" /></div>

        {/* CENTER */}
        <div className="bk-center">
          <div className="final-top">
            <div className="final-label">Marea Finală</div>
            <KOCard koId="final" store={store} />
          </div>
          <Trophy store={store} />
          <div className="bronze-bot">
            <div className="final-label bronze">Finala mică · Locul 3</div>
            <KOCard koId="bronze" store={store} />
          </div>
        </div>

        {/* RIGHT SF */}
        <div className="bk-conn right flat"><div className="line" /></div>
        <div className="bk-col sf-col">
          <KOCard koId="sf2" store={store} label="Semifinala 2" />
        </div>

        {/* RIGHT QF */}
        <div className="bk-conn right"><div className="bracket-shape" /></div>
        <div className="bk-col qf-col">
          <KOCard koId="qf3" store={store} label="Sfert 3" />
          <KOCard koId="qf4" store={store} label="Sfert 4" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KOSlot, KOCard, Trophy, Bracket });
