import React, { useMemo } from "react";
import { isBetweenDates, isSameDate, isToday } from "../../calendar/dateUtils";

export function DayCell({ day, month, year, start, end, hover, clicks, theme, holidayName, onClick, onHover }) {
  const date = useMemo(() => new Date(year, month, day), [year, month, day]);
  const today = isToday(date);
  const isStart = isSameDate(date, start);
  const isEnd = isSameDate(date, end);
  const effectiveEnd = end || (clicks === 1 && hover ? hover : null);
  const isMiddle = isBetweenDates(date, start, effectiveEnd) && !isStart && !isSameDate(date, effectiveEnd);
  const isWeekend = [0, 6].includes(new Date(year, month, day).getDay());

  let bg = "transparent";
  let color = isWeekend ? theme.accent : "#444";
  let fontWeight = "400";
  let border = "2px solid transparent";
  let radius = "10px";

  if (isStart || isEnd) {
    bg = theme.accent;
    color = "#fff";
    fontWeight = "700";
  } else if (isMiddle) {
    bg = theme.light;
    color = theme.accent;
    fontWeight = "500";
    radius = "4px";
  }
  if (today && !isStart && !isEnd) {
    border = `2px solid ${theme.accent}`;
    fontWeight = "700";
    color = theme.accent;
  }

  return (
    <button
      onClick={() => onClick(date)}
      onMouseEnter={() => onHover(date)}
      aria-label={`${day}-${month + 1}-${year}${holidayName ? `, ${holidayName}` : ""}`}
      title={holidayName || ""}
      style={{
        width: "100%",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color,
        fontWeight,
        border,
        borderRadius: radius,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        position: "relative",
        padding: 0,
        lineHeight: 1,
      }}
      onMouseOver={(e) => {
        if (!isStart && !isEnd && !isMiddle) {
          e.currentTarget.style.background = theme.light;
          e.currentTarget.style.transform = "scale(1.08)";
        }
      }}
      onMouseOut={(e) => {
        if (!isStart && !isEnd && !isMiddle) e.currentTarget.style.background = "transparent";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {day}
      {today && (
        <span
          style={{
            position: "absolute",
            bottom: "2px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: isStart ? "#fff" : theme.accent,
          }}
        />
      )}
      {holidayName && (
        <span
          style={{
            position: "absolute",
            top: "3px",
            right: "3px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#E04B4B",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.65)",
          }}
        />
      )}
    </button>
  );
}
