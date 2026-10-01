import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          borderRadius: "7px",
          position: "relative",
        }}
      >
        {/* Structural Roof Truss SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Roof Crest */}
          <path d="M3 11l9-7 9 7" />
          {/* Inner Truss */}
          <path d="M12 4v16" />
          {/* Base Beam */}
          <path d="M4 20h16" />
          {/* Diagonal Braces */}
          <path d="M8 20l4-9 4 9" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
