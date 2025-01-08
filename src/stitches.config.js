// src/stitches.config.js
import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#ff4081',
      background: '#ffffff',
      border: '#e0e0e0',
      text: '#333333',
      muted: '#888888',
      highlight: '#ffefc6',
      event: '#ff4500',
    },
    space: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
    },
    radii: {
      sm: '4px',
      md: '8px',
    },
    fonts: {
      default: 'Arial, sans-serif',
    },
  },
  utils: {
    marginX: (value) => ({ marginLeft: value, marginRight: value }),
    paddingX: (value) => ({ paddingLeft: value, paddingRight: value }),
  },
});
