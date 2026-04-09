import React from "react";
import { MONTHS } from "../../calendar/data";

export function YearView({ year, currentMonth, theme, darkMode, onPick, onClose }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: darkMode ? "rgba(14,17,23,0.95)" : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(16px)",
        zIndex: 50,
        borderRadius: "0 0 20px 20px",
        display: "flex",
        flexDirection: "column",
        padding: "20px 24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "600", color: darkMode ? "#E8EDF5" : "#2D2D2D" }}>
          {year}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#aaa", padding: "4px 8px" }}>
          ✕
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", flex: 1 }}>
        {MONTHS.map((monthName, index) => (
          <button
            key={monthName}
            onClick={() => onPick(index)}
            style={{
              padding: "12px 6px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: index === currentMonth ? "700" : "400",
              background: index === currentMonth ? theme.accent : "transparent",
              color: index === currentMonth ? "#fff" : darkMode ? "#A9B2C3" : "#666",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              if (index !== currentMonth) e.currentTarget.style.background = theme.light;
            }}
            onMouseOut={(e) => {
              if (index !== currentMonth) e.currentTarget.style.background = "transparent";
            }}
          >
            {monthName.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}
