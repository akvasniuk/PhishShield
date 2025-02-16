import COLORS from './colors.json'; // Importing color definitions
import { varAlpha, createPaletteChannel } from '../styles';

// Grey Shades
export const grey = createPaletteChannel(COLORS.grey);

// Primary Color
export const primary = createPaletteChannel(COLORS.primary);

// Secondary Color
export const secondary = createPaletteChannel(COLORS.secondary);

// Info
export const info = createPaletteChannel(COLORS.info);

// Success
export const success = createPaletteChannel(COLORS.success);

// Warning
export const warning = createPaletteChannel(COLORS.warning);

// Error
export const error = createPaletteChannel(COLORS.error);

// Common Colors (e.g., White, Black)
export const common = createPaletteChannel(COLORS.common);

// Text Colors
export const text = {
  light: createPaletteChannel({
    primary: grey[800], // Darker text for light mode
    secondary: grey[600],
    disabled: grey[500],
  }),
  dark: createPaletteChannel({
    primary: grey[100], // Lighter text for dark mode
    secondary: grey[300],
    disabled: grey[500], // Keeps similar contrast for disabled text
  }),
};

// Background Colors
export const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF', // White for cards (light mode)
    default: grey[100], // Light gray as the background
    neutral: grey[200], // Additional neutral shade
  }),
  dark: createPaletteChannel({
    paper: '#121212', // Dark mode surfaces
    default: '#121212', // Full dark for primary background
    neutral: grey[900], // Neutral dark grays
  }),
};

// Action Colors (Hover, Selected, etc.)
export const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08), // Base hover effect
  selected: varAlpha(grey['500Channel'], 0.16), // Selection background
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8), // Disabled text
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

export const action = {
  light: {
    ...baseAction,
    active: grey[600], // Slightly darker gray for light mode
  },
  dark: {
    ...baseAction,
    active: grey[400], // Softer gray for dark mode
    hover: varAlpha(grey['500Channel'], 0.08), // Consistent hover behavior
    selected: varAlpha(grey['500Channel'], 0.16),
    focus: varAlpha(grey['500Channel'], 0.24),
    disabled: varAlpha(grey['500Channel'], 0.5), // Adjust opacity for dark contrast
    disabledBackground: varAlpha(grey['500Channel'], 0.12), // Less intrusive disabled
  },
};

// Divider Colors
export const divider = varAlpha(grey['500Channel'], 0.2);

// Base Palette (Shared Across Light and Dark Modes)
export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider,
  action,
};

// Light Palette
export const lightPalette = {
  ...basePalette, // Inherit shared base palette
  text: text.light, // Use light mode text
  background: background.light, // Use light mode background
  action: action.light, // Use light mode action
};

// Dark Palette
export const darkPalette = {
  ...basePalette, // Inherit shared base palette
  text: text.dark, // Use dark mode text
  background: background.dark, // Use dark mode background
  action: action.dark, // Use dark mode action
};

// Color Schemes (Export Both Light and Dark Themes)
export const colorSchemes = {
  light: { palette: lightPalette },
  dark: { palette: darkPalette },
};