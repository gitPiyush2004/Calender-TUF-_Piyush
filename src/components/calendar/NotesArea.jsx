import React from "react";
import { MONTHS } from "../../calendar/data";

export function NotesArea({ month, year, start, end, theme, darkMode, notes, setNotes, rangeNotes, setRangeNotes }) {
  const monthKey = `${year}-${month}`;
  const rangeKey = start && end ? `${start.toDateString()}_${end.toDateString()}` : null;
  const noteBorder = darkMode ? `${theme.mid}55` : `${theme.mid}30`;
  const noteText = darkMode ? "#D5DDED" : "#555";
  const noteBackground = darkMode ? "rgba(18,24,34,0.86)" : `${theme.light}60`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px" }}>✎</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: "700", color: theme.accent, letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Reflections & Notes
        </span>
      </div>

      <textarea
        value={notes[monthKey] || ""}
        onChange={(e) => setNotes((prev) => ({ ...prev, [monthKey]: e.target.value }))}
        placeholder={`Thoughts for ${MONTHS[month]}...`}
        style={{
          width: "100%",
          minHeight: "52px",
          padding: "10px 12px",
          border: `1px solid ${noteBorder}`,
          borderRadius: "10px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12.5px",
          color: noteText,
          background: noteBackground,
          resize: "vertical",
          outline: "none",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.accent;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = noteBorder;
        }}
      />

      {rangeKey && (
        <textarea
          value={rangeNotes[rangeKey] || ""}
          onChange={(e) => setRangeNotes((prev) => ({ ...prev, [rangeKey]: e.target.value }))}
          placeholder="Note for selected range..."
          style={{
            width: "100%",
            minHeight: "40px",
            padding: "10px 12px",
            marginTop: "8px",
            border: `1px solid ${theme.accent}25`,
            borderRadius: "10px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12.5px",
            color: noteText,
            background: noteBackground,
            resize: "vertical",
            outline: "none",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.accent;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = `${theme.accent}25`;
          }}
        />
      )}
    </div>
  );
}
