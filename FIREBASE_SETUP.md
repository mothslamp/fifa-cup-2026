# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Get Started" → Sign in with Google
3. Click "Create a project"
4. Project name: `fifa-cup-2026`
5. Accept terms → Create project
6. Wait for creation to complete

## Step 2: Set up Realtime Database

1. In Firebase Console, go to **Build** → **Realtime Database**
2. Click **Create Database**
3. Location: **Europe (eur3)** - or closest to you
4. Security rules: Start in **Test Mode** (allows all reads/writes)
5. Click **Enable**

## Step 3: Get Firebase Config

1. In Firebase Console, click the gear icon → **Project Settings**
2. Go to **Service Accounts** tab
3. At the bottom, find the **Config** section (under "firebaseConfig")
4. Copy the config object

## Step 4: Update index.html

1. Open `index.html` in a text editor
2. Find this section (around line 360):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA8_Ks2ZZdXWZq5FZ_-8ZZ5ZZZ5ZZZ5ZZZ",
  authDomain: "fifa-cup-2026.firebaseapp.com",
  projectId: "fifa-cup-2026",
  databaseURL: "https://fifa-cup-2026-default-rtdb.europe-west1.firebaseio.com",
  storageBucket: "fifa-cup-2026.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

3. Replace with your actual Firebase config from Step 3
4. Save the file

## Step 5: Deploy to GitHub Pages

### Option A: Using GitHub Web UI (easiest)

1. Create GitHub account if you don't have one
2. Go to [github.com/new](https://github.com/new)
3. Repository name: `fifa-cup-2026`
4. Make it **Public**
5. Click **Create repository**
6. Click **Upload files**
7. Drag & drop your `index.html` file
8. Commit changes
9. Go to **Settings** → **Pages**
10. Set source to **main branch** → Save
11. Wait 1-2 minutes, then access at: `https://yourusername.github.io/fifa-cup-2026`

### Option B: Using Git command line

```bash
cd "c:\Users\vtronciu\Desktop\FIFA TDV 2026"
git init
git add index.html
git commit -m "Initial commit: FIFA Cup 2026 tracker"
git branch -M main
git remote add origin https://github.com/yourusername/fifa-cup-2026.git
git push -u origin main
```

Then enable Pages in GitHub Settings (see Step 5, Option A, step 9+)

## Step 6: Share the Link

Share `https://yourusername.github.io/fifa-cup-2026` with your colleagues.

Everyone can now:
- View live match updates
- Change match dates in the Reschedule tab
- Mark match winners
- See standings update in real-time

## Troubleshooting

### "Firebase init skipped - using localStorage only"
- Check your Firebase config in `index.html`
- Verify the Firebase project exists in console
- Check browser console for errors (F12)

### Changes not syncing between users
- Make sure all users are on the same URL
- Refresh the page if stuck
- Check Firebase Realtime Database rules (should be Test Mode)

### Database rules error
Go to **Realtime Database** → **Rules** tab and paste:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Then click **Publish**

---

**Questions?** Check [Firebase docs](https://firebase.google.com/docs/database) or Firebase console error logs.
