# PoseGuide

A phone web app for the person **taking** the photo. Pick a pose, and they get:

- a see-through outline of the pose on top of the live camera (drag to move, pinch to resize, double-tap to reset)
- step-by-step lines to read out loud ("Put all your weight on your back leg…")
- photographer reminders (phone height, distance, framing) plus tips for the location/light
- **Her notes**: your personal rules ("my left is my good side") shown on every shot
- **Use my own example photo**: load any photo from your camera roll as the see-through guide
- a level so the phone is held straight, a rule-of-thirds grid, and a flip button to mirror the pose

Photos are kept on the phone only, until you tap **Save** (opens the phone's share sheet, then choose "Save Image").

## Files

| File | What it is |
|------|------------|
| `index.html` | The screens |
| `styles.css` | Look and layout |
| `app.js` | Camera, outline drawing, gestures, tips, saving |
| `poses.js` | **The pose library.** Add or edit poses, tips and locations here |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Let it be added to the home screen and open offline |

## Adding a pose

Copy an entry in `poses.js`. Each pose's body is a set of joint points in a 100 × 200 box
(head at the top, feet near y = 190). Change the numbers and refresh to see the outline move.

## Running it

Phone browsers only allow camera access on **https://** sites (or `localhost`), so to use it on a phone
it needs to be hosted somewhere with https: GitHub Pages, Netlify or Cloudflare Pages all work for free,
since it's just static files.

To try it on the computer: serve the folder with any static server and open `http://localhost:<port>`.
With no camera it shows a practice background.

## Known limits

- The photo is grabbed from the live camera feed, so it's lower resolution than the phone's own camera app
  (usually 1080p–4K depending on the phone). Fine for Instagram; not for printing big.
- The web can't pick the iPhone 2× lens or control focus, so step back instead of zooming.
- Outlines are simple hand-made figures. They're guides, not exact body shapes.
