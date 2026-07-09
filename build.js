const fs = require('fs');
const path = require('path');

// Read the template
const template = fs.readFileSync('index.template.html', 'utf-8');

// Firebase config (persists from existing index.html if it exists)
const firebaseConfig = `const firebaseConfig = {
  apiKey: "AIzaSyAbSXfbaLd65gkXRHPIMaCFSR9vOgoZYHU",
  authDomain: "fifa-tdv-2026.firebaseapp.com",
  databaseURL: "https://fifa-tdv-2026-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fifa-tdv-2026",
  storageBucket: "fifa-tdv-2026.firebasestorage.app",
  messagingSenderId: "131998574488",
  appId: "1:131998574488:web:c8ec5d6a5ffbe1d3006ded",
  measurementId: "G-8VZ53EQF8F"
};`;

// Read component files
const dataContent = fs.readFileSync('data.js', 'utf-8');
const engineContent = fs.readFileSync('engine.jsx', 'utf-8');
const componentsContent = fs.readFileSync('components.jsx', 'utf-8');
const bracketContent = fs.readFileSync('bracket.jsx', 'utf-8');
const appContent = fs.readFileSync('app.jsx', 'utf-8');

// Find the insertion points in template
const dataMarker = '<!-- ============ data ============ -->';
const engineMarker = '<!-- ============ engine ============ -->';
const componentsMarker = '<!-- ============ components ============ -->';
const bracketMarker = '<!-- ============ bracket ============ -->';
const appMarker = '<!-- ============ app ============ -->';

let output = template;

// Replace data section
output = output.replace(
  new RegExp(`${escapeRegex(dataMarker)}[\\s\\S]*?${escapeRegex(engineMarker)}`),
  `${dataMarker}\n<script>\n${dataContent}\n</script>\n\n${engineMarker}`
);

// Replace firebase init section
output = output.replace(
  new RegExp(`try \\{[\\s\\S]*?\\} catch \\(e\\) \\{[\\s\\S]*?\\}`),
  `try {
  ${firebaseConfig}
  firebase.initializeApp(firebaseConfig);
  window.firebaseDb = firebase.database();
  window.firebaseReady = true;
  window.firebaseAuthReady = false;
  firebase.auth().signInAnonymously().catch(e => console.warn('Anonymous sign-in failed:', e));
  firebase.auth().onAuthStateChanged(user => {
    window.firebaseAuthReady = !!user;
  });
} catch (e) {
  console.warn('Firebase init skipped - using localStorage only');
  window.firebaseReady = false;
}`
);

// Replace engine section
output = output.replace(
  new RegExp(`${escapeRegex(engineMarker)}[\\s\\S]*?${escapeRegex(componentsMarker)}`),
  `${engineMarker}\n<script type="text/babel">\n${engineContent}\n</script>\n\n${componentsMarker}`
);

// Replace components section
output = output.replace(
  new RegExp(`${escapeRegex(componentsMarker)}[\\s\\S]*?${escapeRegex(bracketMarker)}`),
  `${componentsMarker}\n<script type="text/babel">\n${componentsContent}\n</script>\n\n${bracketMarker}`
);

// Replace bracket section
output = output.replace(
  new RegExp(`${escapeRegex(bracketMarker)}[\\s\\S]*?${escapeRegex(appMarker)}`),
  `${bracketMarker}\n<script type="text/babel">\n${bracketContent}\n</script>\n\n${appMarker}`
);

// Replace app section
output = output.replace(
  new RegExp(`${escapeRegex(appMarker)}[\\s\\S]*?</body>`),
  `${appMarker}\n<script type="text/babel">\n${appContent}\n</script>\n</body>`
);

// Write the output
fs.writeFileSync('index.html', output);
console.log('✅ Build complete: index.html generated from components');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
