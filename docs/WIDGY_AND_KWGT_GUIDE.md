# AmoreMio: Widgy (iOS) & KWGT (Android) Setup Guide

This guide walks you through connecting your **AmoreMio** app to your partner's iPhone Home Screen widget (via Widgy) and your Android phone (via KWGT or PWA).

---

## 1. How the Live Feed Works

Your application serves a dedicated, clean JSON endpoint designed specifically for widget engines:

```text
GET /api/widget?partner=partner2   # (For your partner's iPhone)
GET /api/widget?partner=partner1   # (For your Android phone)
```

### Sample JSON Payload:
```json
{
  "app_name": "Amore Mio",
  "headline": "Question of the Day",
  "question_text": "What was the exact moment you realized you had real feelings for me?",
  "question_category": "MEMORIES",
  "days_together": "492 Days Together",
  "days_together_num": 492,
  "partner_name": "Valentina",
  "partner_mood": "🥰 In love",
  "partner_mood_emoji": "🥰",
  "partner_status_badge": "Valentina answered! 🔒",
  "unlock_status": "locked",
  "status_message": "Valentina already answered! Tap to submit yours & reveal",
  "last_poke_text": "💋 Sent you a sweet kiss!",
  "last_poke_time": "10:30 PM",
  "deep_link_url": "https://your-domain.vercel.app/?partner=partner2"
}
```

---

## 2. Setting Up on Your Partner's iPhone (Widgy)

1. **Install Widgy**:
   - Download **Widgy Widgets** from the iOS App Store (free for 1 widget slot).
2. **Create a Medium Widget**:
   - Open Widgy &rarr; Tap **Create** &rarr; Select **Medium (2x2 width)**.
   - Choose a nice background color or gradient (e.g. soft rose/pink `#F43F5E` to `#BE123C`).
3. **Connect to Your JSON Feed**:
   - Add a **Text Layer** for the Question.
   - In layer properties, tap **Data** &rarr; **JSON Endpoint**.
   - Enter your deployed URL:
     `https://your-domain.vercel.app/api/widget?partner=partner2`
   - Select key: `question_text`.
4. **Add Status & Mood**:
   - Add another Text Layer &rarr; Data &rarr; JSON Endpoint &rarr; `partner_status_badge`.
   - Add another Text Layer &rarr; Data &rarr; JSON Endpoint &rarr; `days_together`.
5. **Set Tap Action (Deep Link)**:
   - In Widgy, add an **Interactive / Tap Action Layer**.
   - Set action to **Open URL**:
     `https://your-domain.vercel.app/?partner=partner2`
   - Now, when she taps the widget, Safari immediately opens directly into the app ready to answer!
6. **Export & Share**:
   - In Widgy, tap **Share** &rarr; **Export as QR Code**.
   - You can literally send her the QR screenshot. She opens Widgy &rarr; Import &rarr; Scans QR Code. Done!

---

## 3. Setting Up on Your Android Phone

### Option A: Install as PWA (Fastest & Native App Feel)
1. Open your app URL in **Google Chrome** on your Android phone.
2. Tap the three dots menu &rarr; **Add to Home screen** (or "Install App").
3. The app is added directly to your home screen with its own icon and runs full screen with no browser address bar!

### Option B: Home Screen Widget with KWGT (Kustom Widget)
1. Install **KWGT Kustom Widget Maker** from Google Play.
2. Add a 4x2 widget to your home screen.
3. Add a text item, open the formula editor, and fetch the live question:
   ```text
   $wg("https://your-domain.vercel.app/api/widget?partner=partner1", json, .question_text)$
   ```
4. Set touch action to open Chrome or your PWA app.

---

## 4. Deploying for Free to the Cloud (Vercel)

To get a permanent public `https://...` URL for Widgy and your partner:
1. Push this project to a private GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **Import Project**.
3. Vercel automatically detects Next.js and deploys it in ~40 seconds.
4. Your free custom URL will be `https://amoremio-xxx.vercel.app`!
