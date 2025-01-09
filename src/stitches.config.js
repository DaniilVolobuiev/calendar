// src/stitches.config.js
import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  theme: {
    colors: {
      primary: "#4A90E2",
      secondary: "#F06292", 
      background: "#F9FAFB", 
      border: "#D1D5DB",
      text: "#1F2937", 
      muted: "#6B7280", 
      highlight: "#FFFBCC", 
      event: "#FF6B6B",
    },
    space: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
    },
    radii: {
      sm: "4px",
      md: "8px",
    },
  },
  utils: {
    marginX: (value) => ({ marginLeft: value, marginRight: value }),
    paddingX: (value) => ({ paddingLeft: value, paddingRight: value }),
  },
});
