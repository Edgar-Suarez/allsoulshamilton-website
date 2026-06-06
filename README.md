# All Souls Parish — Website Content Guide

This guide explains how to update the website content **without touching any code**.
All texts, schedules, and sponsor listings live in three plain-text JSON files —
one per language. Open the file, change the text, save.

---

## Where the Content Files Are

```
src/locales/
├── en.json   ← English content
├── es.json   ← Spanish / Español content
└── it.json   ← Italian / Italiano content
```

Open any of these files in any text editor (Notepad, TextEdit, VS Code).

---

## How to Update the Mass Schedule

Open `src/locales/en.json` (repeat for `es.json` and `it.json`).

Find the `"masses"` array:

```json
"masses": [
  { "day": "Monday – Friday", "time": "9:00 AM",  "language": "English", "notes": "" },
  { "day": "Saturday",        "time": "5:00 PM",  "language": "English", "notes": "Vigil Mass" },
  { "day": "Sunday",          "time": "10:00 AM", "language": "Spanish", "notes": "" }
]
```

- **Change a time:** Edit the `"time"` value (e.g. `"9:00 AM"` → `"9:30 AM"`)
- **Add a Mass:** Copy any line, paste it, edit the values
- **Remove a Mass:** Delete the entire `{ ... }` line

> Keep `"time"` the same in all three language files.
> Translate only `"day"`, `"language"`, and `"notes"`.

---

## How to Update the Sponsors List

Find `"sponsors"` → `"list"` in each JSON:

```json
"list": [
  { "name": "Bay Gardens Funeral Home", "category": "Funeral Services", "phone": "905-574-6405" },
  { "name": "Ideal Kitchen Inc.",       "category": "Kitchen & Home",   "phone": "" }
]
```

- **Add:** Copy a line, paste at the end, fill in name / category / phone
- **Remove:** Delete that line
- Leave `"phone": ""` if there is no phone number

---

## How to Update Contact Information

Find `"contact"` in each JSON:

```json
"contact": {
  "address":  "21 Barton Street West, Hamilton, Ontario  L8L 1A2",
  "phone":    "(905) 528-1513",
  "email":    "allsoulshamilton@hamiltondiocese.com",
  "officeHoursLines": [
    "Mon, Tue, Thu & Fri: 10:00 AM – 4:00 PM",
    "Closed Wednesday, Saturday & Sunday"
  ]
}
```

---

## How to Update the "Last Updated" Date

Find `"footer"` at the bottom of each JSON:

```json
"footer": {
  "lastUpdated": "Last updated: June 5, 2026"
}
```

Change the date whenever you publish new content. Update all three files.

---

## How to Replace Church Photos

Photos are stored in `public/images/`. Replace any file with a new image
using the **exact same filename**:

| File | Used in |
|------|---------|
| `church-exterior.jpg` | Hero background (congregation photo) |
| `church-building.jpg` | Gallery — church exterior |
| `ceiling-mural.jpg`   | Gallery — ceiling mural |
| `altar-interior.jpg`  | Gallery — altar interior |

---

## Running Locally

```bash
npm install        # first time only
npm run dev        # preview at http://localhost:3001
npm run build      # check for errors before publishing
```

---

## Deploying to Production

```bash
npx vercel --prod
```

Or push to your GitHub repository — Vercel redeploys automatically on every push.

---

## Quick Reference Table

| What to change              | File                     | Key                        |
|-----------------------------|--------------------------|----------------------------|
| Mass schedule               | `src/locales/en.json`    | `schedule.masses`          |
| Sponsor names & phones      | `src/locales/en.json`    | `sponsors.list`            |
| Parish address / phone      | `src/locales/en.json`    | `contact`                  |
| Office hours                | `src/locales/en.json`    | `contact.officeHoursLines` |
| Hero welcome message        | `src/locales/en.json`    | `hero.welcome`             |
| Donation instructions       | `src/locales/en.json`    | `donations`                |
| "Last updated" date         | `src/locales/en.json`    | `footer.lastUpdated`       |
| Photos                      | `public/images/`         | Replace `.jpg` files       |

> Always edit **all three files** (en, es, it) when changing schedules or contact info.

---

*Built with Next.js 16 + Tailwind CSS — Diocese of Hamilton*
