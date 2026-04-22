# Installing Pulse on your iPhone

PWAs need to be served over HTTPS before Safari will let you add them to the home screen.
The fastest free option is Vercel — takes about 3 minutes.

---

## Option A — Vercel (recommended, free, 3 min)

1. Go to https://vercel.com and sign up / log in with GitHub
2. Click **Add New → Project**
3. Drag the entire `Pulse App` folder into the upload area
   (or push it to a GitHub repo and import from there)
4. Hit **Deploy** — Vercel gives you a URL like `pulse-app.vercel.app`
5. Open that URL on your iPhone in **Safari**
6. Tap the **Share** button → **Add to Home Screen** → **Add**

Done. The app icon appears on your home screen, opens full-screen with no browser chrome,
and works completely offline after the first load.

---

## Option B — GitHub Pages (also free, ~5 min)

1. Create a new repo on GitHub, e.g. `vlad-pulse`
2. Push the `Pulse App` folder contents to the repo root
3. Go to **Settings → Pages → Source → main branch / root**
4. GitHub gives you `https://yourusername.github.io/vlad-pulse/pulse.html`
5. Open that URL in Safari on iPhone → Share → Add to Home Screen

---

## Option C — Local network (no internet required)

If you just want to test on your phone while on the same Wi-Fi:

```bash
cd "Pulse App"
npx serve .
```

Then open `http://YOUR-MAC-IP:3000/pulse.html` in Safari on your iPhone.
(Find your Mac IP in System Settings → Wi-Fi → Details)

Note: Service worker / offline mode won't activate over plain HTTP,
but the app will still work fine for testing.

---

## What you get on the home screen

- Full-screen app (no Safari address bar)
- Status bar blends into the dark header
- Safe area padding for notch + home indicator
- Completely offline after first load (localStorage persists your checks + streak)
- Yellow lightning bolt icon on your home screen
