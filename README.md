Interactive Wall Calendar
- A premium, interactive calendar component inspired by a physical wall calendar, built with a strong focus on UI/UX, performance, and clean architecture by Piyush Bhatia.

- Live Demo: https://calender-tuf-piyush.vercel.app
- Repository: https://github.com/gitPiyush2004/Calender-TUF-_Piyush
  
------------------------------------------------------------
* Features
- Interactive Calendar
Fully functional monthly calendar grid
Accurate date alignment using modern date utilities
Highlights:
Current day
Selected start & end dates
Range in between

- Date Range Selection
Click once → Start date
Click again → End date
Automatically highlights selected range
Resets intelligently on new selection

- Notes System
Add notes for the month
Persistent storage using localStorage
Seamless UX with instant updates

- Wall Calendar Aesthetic
Inspired by real-world hanging calendars
Hero image with month/year overlay
Clean typography and visual hierarchy

- Fully Responsive
Desktop: Split layout (Image + Calendar)
Mobile: Stacked layout for touch usability

-----------------------------------------------------------
- Tech Stack
Frontend: React (Vite)
Language: TypeScript
Styling: Tailwind CSS
State Management: React Hooks
Date Handling: date-fns
Deployment: Vercel
-----------------------------------------------------------

* Design & Engineering Decisions
-Focused on component-driven architecture for scalability
-Separated logic using custom hooks (useCalendar, useDateRange)
-Used Tailwind for rapid UI iteration and consistency
-Prioritized UX clarity (clear selection states, smooth interactions)
-Designed layout to mimic a physical wall calendar with modern usability

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

** Highlights
Clean and scalable architecture
Thoughtful UX with interactive feedback
Production-ready code structure
Fully deployed and accessible

-------------------------------------------------------------------

-Author
Piyush Bhatia
Developer | UI/UX Enthusiast

License
This project was built for assessment purposes as part of the TakeUForward internship program.


