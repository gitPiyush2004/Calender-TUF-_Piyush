import React from "react";

export function Spirals() {
  return (
    <div
      style={{
        position: "absolute",
        top: "-14px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: "22px",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          style={{
            width: "12px",
            height: "26px",
            borderRadius: "6px",
            background: "linear-gradient(180deg, #D4D4D4 0%, #999 35%, #B0B0B0 65%, #E0E0E0 100%)",
            boxShadow: "0 3px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.5)",
            border: "0.5px solid rgba(0,0,0,0.12)",
          }}
        />
      ))}
    </div>
  );
}
