import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { DAYS, HERO_IMAGES, HERO_IMAGE_FALLBACKS, MONTHS, THEMES } from "./calendar/data";
import { daysInMonth, firstWeekdayMondayStart } from "./calendar/dateUtils";
import { useHeroImage } from "./hooks/useHeroImage";
import { DayCell } from "./components/calendar/DayCell";
import { NotesArea } from "./components/calendar/NotesArea";
import { Spirals } from "./components/calendar/Spirals";
import { YearView } from "./components/calendar/YearView";

const initialRange = { start: null, end: null, clicks: 0, hover: null };

function rangeReducer(state, action) {
  switch (action.type) {
    case "hover":
      return { ...state, hover: action.date };
    case "clear":
      return initialRange;
    case "click": {
      const date = action.date;
      if (state.clicks === 0) return { start: date, end: null, clicks: 1, hover: null };
      if (state.clicks === 1) {
        if (date.getTime() < state.start.getTime()) return { start: date, end: state.start, clicks: 2, hover: null };
        return { ...state, end: date, clicks: 2, hover: null };
      }
      return { start: date, end: null, clicks: 1, hover: null };
    }
    default:
      return state;
  }
}

function useUiTheme(darkMode, monthTheme) {
  return useMemo(
    () => ({
      pageBg: darkMode
        ? "radial-gradient(ellipse at 20% 20%, rgba(108,72,79,0.28) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(88,50,58,0.3) 0%, transparent 55%), linear-gradient(145deg, #1F181B 0%, #241C21 35%, #262029 70%, #1A171E 100%)"
        : "radial-gradient(ellipse at 25% 15%, rgba(186,144,144,0.28) 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(170,132,132,0.2) 0%, transparent 55%), linear-gradient(145deg, #D1C5C3 0%, #C1B0AE 30%, #CDBEBC 55%, #BBA9A8 80%, #CDC0BE 100%)",
      cardBg: darkMode ? "#171D27" : monthTheme.bg,
      cardShadow: darkMode ? "drop-shadow(0 26px 60px rgba(0,0,0,0.45))" : "drop-shadow(0 30px 70px rgba(0,0,0,0.2))",
      panelText: darkMode ? "#E8EDF5" : "#2D2D2D",
      faintText: darkMode ? "#7F8AA1" : "#BBB",
      altCell: darkMode ? "#5F6B82" : "#ccc",
      mutedText: darkMode ? "#A9B2C3" : "#888",
      glassBtnBg: darkMode ? "linear-gradient(145deg, rgba(243,247,255,0.2), rgba(220,230,255,0.08))" : "linear-gradient(145deg, rgba(255,255,255,0.75), rgba(255,255,255,0.32))",
      glassBtnBorder: darkMode ? "1px solid rgba(220,232,255,0.24)" : "1px solid rgba(255,255,255,0.56)",
    }),
    [darkMode, monthTheme.bg],
  );
}

export default function WallCalendarApp() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [notes, setNotes] = useState({});
  const [rangeNotes, setRangeNotes] = useState({});
  const [isYearViewOpen, setIsYearViewOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [rangeState, dispatchRange] = useReducer(rangeReducer, initialRange);

  const theme = THEMES[currentMonth];
  const ui = useUiTheme(isDarkMode, theme);
  const { imageSrc, isLoaded } = useHeroImage(HERO_IMAGES[currentMonth], HERO_IMAGE_FALLBACKS[currentMonth]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const grid = useMemo(() => {
    const cells = [];
    const firstDay = firstWeekdayMondayStart(currentYear, currentMonth);
    const currentDim = daysInMonth(currentYear, currentMonth);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevDim = daysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i -= 1) cells.push({ day: prevDim - i, current: false });
    for (let day = 1; day <= currentDim; day += 1) cells.push({ day, current: true });
    while (cells.length < 42) cells.push({ day: cells.length - firstDay - currentDim + 1, current: false });
    return cells;
  }, [currentMonth, currentYear]);

  const runFlip = useCallback((direction, updateMonth) => {
    if (isFlipping) return;
    setFlipDirection(direction);
    setIsFlipping(true);
    setTimeout(() => {
      updateMonth();
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 350);
    }, 280);
  }, [isFlipping]);

  const navigateMonth = useCallback((direction) => {
    runFlip(direction, () => {
      if (direction === "next") {
        setCurrentMonth((prev) => {
          if (prev === 11) {
            setCurrentYear((y) => y + 1);
            return 0;
          }
          return prev + 1;
        });
        return;
      }
      setCurrentMonth((prev) => {
        if (prev === 0) {
          setCurrentYear((y) => y - 1);
          return 11;
        }
        return prev - 1;
      });
    });
  }, [runFlip]);

  const jumpToMonth = useCallback((monthIndex) => {
    setIsYearViewOpen(false);
    if (monthIndex === currentMonth) return;
    runFlip(monthIndex > currentMonth ? "next" : "prev", () => setCurrentMonth(monthIndex));
  }, [currentMonth, runFlip]);

  const goToToday = useCallback(() => {
    runFlip("next", () => {
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
    });
  }, [now, runFlip]);

  const flipAnimation = isFlipping
    ? flipDirection === "next"
      ? "cfOut 0.28s ease-in forwards"
      : "cfOutR 0.28s ease-in forwards"
    : isMounted
      ? "cfIn 0.35s ease-out forwards"
      : "none";

  const selectedRangeDays =
    rangeState.start && rangeState.end
      ? Math.abs(Math.ceil((rangeState.end - rangeState.start) / 86400000)) + 1
      : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'DM Sans', sans-serif", background: ui.pageBg }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes cfOut{0%{transform:perspective(1400px) rotateX(0);opacity:1}100%{transform:perspective(1400px) rotateX(-88deg);opacity:0;transform-origin:top}}
        @keyframes cfOutR{0%{transform:perspective(1400px) rotateX(0);opacity:1}100%{transform:perspective(1400px) rotateX(88deg);opacity:0;transform-origin:bottom}}
        @keyframes cfIn{0%{transform:perspective(1400px) rotateX(85deg);opacity:0;transform-origin:top}100%{transform:perspective(1400px) rotateX(0);opacity:1}}
        @keyframes cfImg{0%{opacity:0;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
        @keyframes cfShm{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes rugShift{0%{background-position:0 0,0 0}100%{background-position:380px 120px,-280px 220px}}
        @keyframes rugPulse{0%{transform:scale(1);opacity:${isDarkMode ? 0.1 : 0.08}}100%{transform:scale(1.03);opacity:${isDarkMode ? 0.16 : 0.12}}}
        @keyframes wmFloat{0%{transform:rotate(-7deg) translateY(10px)}100%{transform:rotate(-5deg) translateY(-6px)}}
        .calendar-shell{display:flex;flex-direction:row}
        .hero-pane{width:44%;min-height:580px}
        .grid-pane{flex:1}
        .nav-btn{background:none;border:none;cursor:pointer;font-size:20px;padding:4px 6px;border-radius:8px;line-height:1;transition:all 0.15s}
        @media(max-width:880px){.calendar-shell{flex-direction:column!important}.hero-pane{width:100%!important;min-height:260px!important;height:260px!important}.grid-pane{width:100%!important}}
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <button
        onClick={() => setIsDarkMode((v) => !v)}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          position: "fixed", top: "16px", right: "16px", zIndex: 80, border: ui.glassBtnBorder, borderRadius: "999px", padding: "8px 12px",
          background: ui.glassBtnBg, color: isDarkMode ? "#F7FBFF" : "#21252E", backdropFilter: "blur(12px)", cursor: "pointer",
          fontSize: "13px", fontWeight: "700", letterSpacing: "0.4px", boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.38)" : "0 10px 30px rgba(0,0,0,0.18)",
        }}
      >
        {isDarkMode ? "☀ Light" : "☾ Dark"}
      </button>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: isDarkMode ? 0.42 : 0.28, backgroundImage: isDarkMode ? "repeating-linear-gradient(117deg, rgba(255,230,230,0.06) 0px, rgba(255,230,230,0.06) 2px, transparent 2px, transparent 13px), repeating-linear-gradient(-31deg, rgba(190,118,130,0.09) 0px, rgba(190,118,130,0.09) 1px, transparent 1px, transparent 11px)" : "repeating-linear-gradient(117deg, rgba(82,48,48,0.07) 0px, rgba(82,48,48,0.07) 2px, transparent 2px, transparent 13px), repeating-linear-gradient(-31deg, rgba(134,82,82,0.07) 0px, rgba(134,82,82,0.07) 1px, transparent 1px, transparent 11px)", backgroundSize: "380px 380px, 290px 290px", animation: "rugShift 14s linear infinite" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: isDarkMode ? 0.14 : 0.1, background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 28%), radial-gradient(circle at 75% 70%, rgba(255,255,255,0.18) 0%, transparent 26%), radial-gradient(circle at 55% 45%, rgba(0,0,0,0.16) 0%, transparent 30%)", animation: "rugPulse 7s ease-in-out infinite alternate" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "min(62vw, 640px)", aspectRatio: "2.5 / 1", backgroundImage: "url('/tuf-logo.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: isDarkMode ? 0.16 : 0.095, filter: "grayscale(1) brightness(1.9) contrast(0.75)", transform: "rotate(-7deg) translateY(10px)", animation: "wmFloat 9s ease-in-out infinite alternate" }} />
      </div>
      <div style={{ position: "fixed", inset: 0, opacity: 0.035, pointerEvents: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      <div style={{ width: "100%", maxWidth: "940px", position: "relative", filter: ui.cardShadow, zIndex: 1 }}>
        <Spirals />
        <div className="calendar-shell" style={{ background: ui.cardBg, borderRadius: "20px", overflow: "hidden", marginTop: "10px" }}>
          <div className="hero-pane" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", backgroundPosition: "center", opacity: isLoaded ? 1 : 0, animation: isLoaded ? "cfImg 0.7s ease-out" : "none", transition: "opacity 0.5s" }} />
            {!isLoaded && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,${theme.light} 25%,${theme.mid}40 50%,${theme.light} 75%)`, backgroundSize: "200% 100%", animation: "cfShm 1.5s infinite" }} />}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.12) 100%)" }} />
            <div style={{ position: "absolute", top: "18px", left: "18px", background: "rgba(255,255,255,0.14)", backdropFilter: "blur(14px)", padding: "5px 14px", borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: "600", color: "rgba(255,255,255,0.9)", letterSpacing: "0.6px", border: "1px solid rgba(255,255,255,0.18)" }}>✦ {theme.name} Edition</div>
            <div style={{ position: "absolute", bottom: "24px", left: "24px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "54px", fontWeight: "700", lineHeight: 1, color: "#fff", letterSpacing: "-1.5px", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}>{currentYear}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "400", fontStyle: "italic", color: "rgba(255,255,255,0.9)", letterSpacing: "3px", textTransform: "uppercase", marginTop: "2px", textShadow: "0 1px 12px rgba(0,0,0,0.3)" }}>{MONTHS[currentMonth]}</div>
              <div style={{ marginTop: "6px", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "12px", letterSpacing: "0.4px", color: "rgba(255,255,255,0.82)" }}>Crafted moments, one day at a time</div>
            </div>
          </div>

          <div className="grid-pane" style={{ padding: "22px 26px 18px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
            {isYearViewOpen && <YearView year={currentYear} currentMonth={currentMonth} theme={theme} darkMode={isDarkMode} onPick={jumpToMonth} onClose={() => setIsYearViewOpen(false)} />}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: "700", color: theme.accent, letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: "1px" }}>Exploring</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button className="nav-btn" onClick={() => navigateMonth("prev")} style={{ color: theme.accent }} aria-label="Previous month">‹</button>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "600", color: ui.panelText }}>{MONTHS[currentMonth]} {currentYear}</span>
                  <button className="nav-btn" onClick={() => navigateMonth("next")} style={{ color: theme.accent }} aria-label="Next month">›</button>
                </div>
                <div style={{ marginTop: "2px", color: ui.mutedText, fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "12px", letterSpacing: "0.2px" }}>A precise planner for focused work</div>
              </div>

              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={goToToday} style={{ background: theme.light, border: "none", borderRadius: "8px", padding: "5px 11px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: "600", color: theme.accent, cursor: "pointer" }}>Today</button>
                <button onClick={() => setIsYearViewOpen((v) => !v)} style={{ background: theme.accent, border: "none", borderRadius: "8px", padding: "5px 11px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: "600", color: "#fff", cursor: "pointer" }}>📅 Year</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px", marginBottom: "4px" }}>
              {DAYS.map((day, index) => (
                <div key={day} style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: "700", color: index >= 5 ? theme.accent : ui.faintText, letterSpacing: "1.2px", padding: "3px 0" }}>{day}</div>
              ))}
            </div>

            <div style={{ animation: flipAnimation, transformStyle: "preserve-3d" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}>
                {grid.map((cell, index) => (
                  <div key={`${currentMonth}-${currentYear}-${index}`} style={{ opacity: cell.current ? 1 : 0.22 }}>
                    {cell.current ? (
                      <DayCell day={cell.day} month={currentMonth} year={currentYear} start={rangeState.start} end={rangeState.end} hover={rangeState.hover} clicks={rangeState.clicks} theme={theme} onClick={(date) => dispatchRange({ type: "click", date })} onHover={(date) => dispatchRange({ type: "hover", date })} />
                    ) : (
                      <div style={{ width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: ui.altCell, fontFamily: "'DM Sans', sans-serif" }}>{cell.day}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {rangeState.start && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", padding: "7px 12px", background: `${theme.light}90`, borderRadius: "8px", fontSize: "10.5px", color: ui.mutedText, fontFamily: "'DM Sans', sans-serif" }}>
                <span>
                  {rangeState.start.getDate()} {MONTHS[rangeState.start.getMonth()].slice(0, 3)}
                  {rangeState.end && ` → ${rangeState.end.getDate()} ${MONTHS[rangeState.end.getMonth()].slice(0, 3)} · ${selectedRangeDays} day${selectedRangeDays > 1 ? "s" : ""}`}
                </span>
                <button onClick={() => dispatchRange({ type: "clear" })} style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: "10.5px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif" }}>Clear</button>
              </div>
            )}

            <div style={{ height: "1px", margin: "10px 0", background: `linear-gradient(90deg, transparent, ${theme.mid}30, transparent)` }} />

            <NotesArea month={currentMonth} year={currentYear} start={rangeState.start} end={rangeState.end} theme={theme} darkMode={isDarkMode} notes={notes} setNotes={setNotes} rangeNotes={rangeNotes} setRangeNotes={setRangeNotes} />
          </div>
        </div>

        <div style={{ height: "5px", marginInline: "10px", background: "linear-gradient(180deg, rgba(0,0,0,0.05), transparent)", borderRadius: "0 0 14px 14px" }} />
        <div style={{ height: "3px", marginInline: "20px", background: "linear-gradient(180deg, rgba(0,0,0,0.025), transparent)", borderRadius: "0 0 10px 10px" }} />
      </div>
    </div>
  );
}
