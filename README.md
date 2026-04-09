Interactive Wall Calendar
- A premium, interactive calendar component inspired by a physical wall calendar, built with a strong focus on UI/UX, performance, and clean architecture by Piyush Bhatia.

- Live Demo: https://calender-tuf-piyush.vercel.app
- Repository: https://github.com/gitPiyush2004/Calender-TUF-_Piyush
  
------------------------------------------------------------
## Features

### Core Requirements
- **Wall Calendar Aesthetic** — Clean, physical wall-calendar-inspired layout with a prominent hero image panel paired alongside the date grid.
- **Day Range Selector** — Click a start date and an end date; all days in between are highlighted with distinct visual states for start, end, and in-range days.
- **Integrated Notes Section** — Attach notes to a selected date range or write general monthly memos. Notes persist across navigation using `localStorage`.
- **Fully Responsive Design** — Desktop shows a side-by-side split panel; mobile stacks all sections vertically with full touch support.

### Creative Additions 
- **Month Navigation** — Smoothly navigate forward and backward between months.
- **Holiday Markers** — Common public holidays are automatically marked on the grid with subtle indicators.
- **Theme Switching** — The calendar palette adapts based on the current month (e.g., warm tones for summer, cool blues for winter).
- **Page-Flip Animation** — Month transitions feature a CSS page-flip effect that reinforces the physical calendar feel.
- **Today Highlight** — The current date is always clearly distinguished.
- **Notes Persistence** — All notes are saved to `localStorage` so they survive page refreshes.

-----------------------------------------------------------
### Tech Stack
- Frontend: React (Vite)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: React Hooks
- Date Handling: date-fns
- Deployment: Vercel
-----------------------------------------------------------
##  Design Decisions

- **`WallCalendarApp.jsx` as Root:** All state (selected range, active month, notes) lives here and flows down as props, keeping child components focused and easy to test.
- **`Spirals.jsx` — Physical Calendar Detail:** A dedicated component renders the decorative spiral binding at the top, reinforcing the wall calendar aesthetic without cluttering the layout logic of other components.
- **`YearView.jsx` — Quick Navigation:** A full year overview lets users jump to any month at a glance, going beyond simple prev/next arrows.
- **`useHeroImage.js` Hook:** Isolates the logic for pairing each month with a hero image, making it trivial to swap in different image sets or themes later.
- **`data.js` for Static Content:** Holidays and any other static data are centralized here rather than scattered across components.
- **Split Panel Layout (Desktop):** The hero image lives in the left panel and the calendar grid + notes occupy the right panel, mirroring a physical wall calendar's photo-above-dates format.
- **Stacked Layout (Mobile):** The image collapses to a banner strip, followed by the grid, then the notes area — all scrollable in a single column.
- **Range Selection UX:** Single click sets the start date; a second click on any later date confirms the end. A third click resets the selection. Hovering previews the in-range state before confirming.
- **No Backend:** `localStorage` is used for all persistence. Notes are keyed by date range so each selection has independent storage.

------------------------------------------------------------

##  Project Structure


```
├── src/                        → Application source code
│   ├── WallCalendarApp.jsx     → Root component — wires together all panels
│   ├── calendar/
│   │   ├── data.js             → Static data: holidays & month themes
│   │   └── dateUtils.js        → Date helper functions (range checks, formatting)
│   ├── components/
│   │   └── calendar/
│   │       ├── DayCell.jsx     → Day cell with start / end / in-range / today states
│   │       ├── NotesArea.jsx   → Notes editor keyed by selected date range
│   │       ├── Spirals.jsx     → Decorative spiral binding (wall calendar aesthetic)
│   │       └── YearView.jsx    → Full year overview & month-jump navigation
│   ├── hooks/
│   │   └── useHeroImage.js     → Month-based hero image selection hook
│   └── main.jsx                → App entry point
├── public/                     → Static assets (images, favicon)
├── index.html                  → HTML shell
├── package.json
├── vite.config.js
└── README.md
```


-----------------------------------------------------------------

Getting Started (Run Locally)
1. Clone the repository
git clone https://github.com/gitPiyush2004/Calender-TUF-_Piyush.git
cd Calender-TUF-_Piyush
3. Install dependencies
npm install
4. Run development server
npm run dev
5. Open in browser
http://localhost:5173


-------------------------------------------------------------------

## Author

**Piyush Bhatia**
GitHub: [@gitPiyush2004](https://github.com/gitPiyush2004)

---

## License

This project was built for assessment purposes as part of the TakeUForward internship program.



