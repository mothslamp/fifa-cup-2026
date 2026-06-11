/* ====================================================================
   FIFA CUP TRADEVILLE — tournament data
   16 teams (pairs) · 4 groups (A, B, D, F) · 24 group matches
   Knockout: top 2 per group -> QF (8) -> SF -> Final + Bronze
   ==================================================================== */

// Group accent colors (echo the reference World Cup bracket)
const GROUPS = {
  A: { id: 'A', name: 'Grupa A', color: '#16c47f', glow: 'rgba(22,196,127,.45)' },
  B: { id: 'B', name: 'Grupa B', color: '#ff3b5c', glow: 'rgba(255,59,92,.45)' },
  D: { id: 'D', name: 'Grupa D', color: '#3b82f6', glow: 'rgba(59,130,246,.45)' },
  F: { id: 'F', name: 'Grupa F', color: '#a3e635', glow: 'rgba(163,230,53,.45)' },
};

// Teams. id = GROUP_CC. p = [player1, player2]
const TEAMS = {
  // Grupa A
  A_MX: { id: 'A_MX', group: 'A', flag: '🇲🇽', country: 'Mexic',         p: ['Răzvan Lucăcel', 'Mihai Ologu'] },
  A_ZA: { id: 'A_ZA', group: 'A', flag: '🇿🇦', country: 'Africa de Sud', p: ['Constantin Ionuț', 'Darius Dumitru'] },
  A_KR: { id: 'A_KR', group: 'A', flag: '🇰🇷', country: 'Coreea de Sud', p: ['Adrian Vișan', 'Mihaela Mihailciuc'] },
  A_CZ: { id: 'A_CZ', group: 'A', flag: '🇨🇿', country: 'Cehia',         p: ['Andrei Vălimăreanu', 'Andrei Peligrad'] },

  // Grupa B
  B_QA: { id: 'B_QA', group: 'B', flag: '🇶🇦', country: 'Qatar',           p: ['Robert Ioniță', 'Gabriel Șipoteanu'] },
  B_CH: { id: 'B_CH', group: 'B', flag: '🇨🇭', country: 'Elveția',         p: ['Mădălin Neagu', 'Daniel Chirițoiu'] },
  B_CA: { id: 'B_CA', group: 'B', flag: '🇨🇦', country: 'Canada',          p: ['Aurelian Fulga', 'Titel Zuda'] },
  B_BA: { id: 'B_BA', group: 'B', flag: '🇧🇦', country: 'Bosnia și Herț.', p: ['Alexandru Dobre', 'Adrian Mădescu'] },

  // Grupa D
  D_US: { id: 'D_US', group: 'D', flag: '🇺🇸', country: 'S.U.A.',     p: ['Cătălin Lefter', 'Nicoleta Crețu'] },
  D_PY: { id: 'D_PY', group: 'D', flag: '🇵🇾', country: 'Paraguay',   p: ['Dan Cănănău', 'Bogdan Marin'] },
  D_AU: { id: 'D_AU', group: 'D', flag: '🇦🇺', country: 'Australia',  p: ['Antonio Angheluță', 'Cristian Popescu'] },
  D_TR: { id: 'D_TR', group: 'D', flag: '🇹🇷', country: 'Türkiye',    p: ['Sergiu Stanciu', 'Claudiu Stan'] },

  // Grupa F
  F_NL: { id: 'F_NL', group: 'F', flag: '🇳🇱', country: 'Olanda',   p: ['Andrei Chirițoiu', 'Alexandru Trușcă'] },
  F_JP: { id: 'F_JP', group: 'F', flag: '🇯🇵', country: 'Japonia',  p: ['Cristian Porumb', 'Aurelian Boldea'] },
  F_SE: { id: 'F_SE', group: 'F', flag: '🇸🇪', country: 'Suedia',   p: ['Bogdan Melniciuc', 'Victor Tronciu'] },
  F_TN: { id: 'F_TN', group: 'F', flag: '🇹🇳', country: 'Tunisia',  p: ['Radu Dăscălescu', 'Alex Nuță'] },
};

// Match schedule. Each: id, date (ISO), label (RO), time?, group, home, away
const MATCHES = [
  { id: 'm01', date: '2026-06-10', label: 'Miercuri 10 Iunie',  group: 'B', home: 'B_QA', away: 'B_CH' },

  { id: 'm02', date: '2026-06-11', label: 'Joi 11 Iunie',       group: 'A', home: 'A_MX', away: 'A_ZA' },
  { id: 'm03', date: '2026-06-11', label: 'Joi 11 Iunie',       group: 'A', home: 'A_KR', away: 'A_CZ' },

  { id: 'm04', date: '2026-06-12', label: 'Vineri 12 Iunie',    group: 'B', home: 'B_CA', away: 'B_BA' },
  { id: 'm05', date: '2026-06-12', label: 'Vineri 12 Iunie',    group: 'D', home: 'D_US', away: 'D_PY' },

  { id: 'm06', date: '2026-06-14', label: 'Duminică 14 Iunie',  group: 'D', home: 'D_AU', away: 'D_TR' },
  { id: 'm07', date: '2026-06-14', label: 'Duminică 14 Iunie',  group: 'F', home: 'F_NL', away: 'F_JP' },

  { id: 'm08', date: '2026-06-17', label: 'Miercuri 17 Iunie',  group: 'F', home: 'F_SE', away: 'F_TN' },

  { id: 'm09', date: '2026-06-18', label: 'Joi 18 Iunie',       group: 'A', home: 'A_CZ', away: 'A_ZA' },
  { id: 'm10', date: '2026-06-18', label: 'Joi 18 Iunie',       group: 'A', home: 'A_MX', away: 'A_KR' },
  { id: 'm11', date: '2026-06-18', label: 'Joi 18 Iunie',       group: 'B', home: 'B_CH', away: 'B_BA' },
  { id: 'm12', date: '2026-06-18', label: 'Joi 18 Iunie',       group: 'B', home: 'B_CA', away: 'B_QA' },

  { id: 'm13', date: '2026-06-19', label: 'Vineri 19 Iunie',    group: 'D', home: 'D_US', away: 'D_AU' },

  { id: 'm14', date: '2026-06-20', label: 'Sâmbătă 20 Iunie',   group: 'D', home: 'D_TR', away: 'D_PY' },
  { id: 'm15', date: '2026-06-20', label: 'Sâmbătă 20 Iunie',   group: 'F', home: 'F_NL', away: 'F_SE' },
  { id: 'm16', date: '2026-06-20', label: 'Sâmbătă 20 Iunie',   group: 'F', home: 'F_TN', away: 'F_JP' },

  { id: 'm17', date: '2026-06-24', label: 'Miercuri 24 Iunie',  group: 'A', home: 'A_CZ', away: 'A_MX' },
  { id: 'm18', date: '2026-06-24', label: 'Miercuri 24 Iunie',  group: 'A', home: 'A_ZA', away: 'A_KR' },
  { id: 'm19', date: '2026-06-24', label: 'Miercuri 24 Iunie',  group: 'B', home: 'B_CH', away: 'B_CA' },
  { id: 'm20', date: '2026-06-24', label: 'Miercuri 24 Iunie',  group: 'B', home: 'B_BA', away: 'B_QA' },

  { id: 'm21', date: '2026-06-25', label: 'Joi 25 Iunie',       group: 'D', home: 'D_US', away: 'D_TR' },
  { id: 'm22', date: '2026-06-25', label: 'Joi 25 Iunie',       group: 'D', home: 'D_AU', away: 'D_PY' },
  { id: 'm23', date: '2026-06-25', label: 'Joi 25 Iunie',       group: 'F', home: 'F_JP', away: 'F_SE' },
  { id: 'm24', date: '2026-06-25', label: 'Joi 25 Iunie',       group: 'F', home: 'F_TN', away: 'F_NL' },
];

// Knockout structure. seeds resolved from group standings at runtime.
// QF crosses winners/runners-up so group winners can only meet in the final.
const KO = {
  qf: [
    { id: 'qf1', a: { seed: 1, grp: 'A' }, b: { seed: 2, grp: 'B' } },
    { id: 'qf2', a: { seed: 1, grp: 'D' }, b: { seed: 2, grp: 'F' } },
    { id: 'qf3', a: { seed: 1, grp: 'F' }, b: { seed: 2, grp: 'D' } },
    { id: 'qf4', a: { seed: 1, grp: 'B' }, b: { seed: 2, grp: 'A' } },
  ],
  sf: [
    { id: 'sf1', a: { from: 'qf1' }, b: { from: 'qf2' } },
    { id: 'sf2', a: { from: 'qf3' }, b: { from: 'qf4' } },
  ],
  final: { id: 'final', a: { from: 'sf1' }, b: { from: 'sf2' } },
  bronze: { id: 'bronze', a: { fromLoser: 'sf1' }, b: { fromLoser: 'sf2' } },
};

const GROUP_ORDER = ['A', 'B', 'D', 'F'];

window.TV = { GROUPS, TEAMS, MATCHES, KO, GROUP_ORDER };
