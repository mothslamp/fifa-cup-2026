# FIFA Cup 2026 - Tournament Tracker

A collaborative web app for tracking group stage matches, standings, and knockout tournaments with **real-time sync** across all participants.

## Features

- 📋 **Group Stage**: 4 groups, standings auto-calculate based on results
- 📅 **Calendar**: View all matches by date
- 🏆 **Knockout Bracket**: QF → SF → Final + 3rd place match
- 🔄 **Reschedule**: Change match dates anytime, calendar updates instantly
- 📱 **Real-time Sync**: All changes sync instantly with Firebase (if configured)
- 💾 **Offline Support**: Works with localStorage if Firebase is unavailable

## Quick Start

### Local Use (Browser Only)
1. Download `index.html`
2. Double-click to open in browser
3. Mark match winners, change dates, see standings update
4. Progress saved in your browser only

### Shared Use (With Real-time Sync)

To share this with teammates who can see each other's updates in real-time:

1. **Set up Firebase** (free):
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create a project called `fifa-cup-2026`
   - Set up Realtime Database (Test Mode)
   - Get your Firebase config

2. **Update `index.html`**:
   - Find the `firebaseConfig` object in the code (search for "AIzaSyA8")
   - Replace with your actual Firebase config values

3. **Deploy to GitHub Pages** (free):
   - Create a GitHub account
   - Create a public repository called `fifa-cup-2026`
   - Upload `index.html`
   - Enable GitHub Pages in Settings
   - Share the link: `https://yourusername.github.io/fifa-cup-2026`

4. **Share with colleagues**:
   - Send them the GitHub Pages link
   - Everyone opens it in their browser
   - All changes sync in real-time

**👉 See `FIREBASE_SETUP.md` for detailed setup instructions**

## How to Use

### Mark Match Winners
- Click on a team name in a match card
- The team gets a checkmark and color highlight
- Standings update automatically
- Click again to undo

### Change Match Dates
- Go to **Reprogramare** tab
- Pick a new date for any match
- Calendar reorganizes instantly

### View Standings
- **Grupe** tab shows all 4 groups
- Top 2 per group advance to knockouts
- Tied teams broken by: wins → head-to-head → country name (alphabetical)

### Follow the Bracket
- **Faza eliminatorie** tab shows QF → SF → Final
- Teams auto-populate from group standings once groups complete
- Provisional leaders show while groups are in progress
- Mark winners to advance teams to next round

## Data

- 16 teams (representing countries)
- 4 groups (A, B, D, F)
- 24 group stage matches
- 4 quarterfinalists
- 2 semifinalists
- 1 champion

Teams: Mexico, South Africa, South Korea, Czechia, Qatar, Switzerland, Canada, Bosnia & Herzegovina, USA, Paraguay, Australia, Turkey, Netherlands, Japan, Sweden, Tunisia

## Architecture

- **Frontend**: React 18 + Babel (in-browser transpilation)
- **Storage**: localStorage (always) + Firebase Realtime Database (optional)
- **Hosting**: GitHub Pages (static files)
- **Sync**: Firebase listeners push updates to all connected users

## Privacy & Security

- No user authentication required
- All data is public (shared on Firebase)
- Firebase runs in Test Mode (no security rules beyond public read/write)
- No personal data stored
- Safe for internal team use

## Browser Support

- Chrome, Firefox, Safari, Edge (any modern browser)
- Mobile-friendly
- No installation required

## License

Free to use and modify.

---

**Need help?** See `FIREBASE_SETUP.md` for step-by-step Firebase & GitHub Pages setup.
