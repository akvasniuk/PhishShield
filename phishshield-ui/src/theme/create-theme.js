import { experimental_extendTheme as extendTheme } from '@mui/material/styles';


import { colorSchemes, components, customShadows, shadows, typography } from './core/index.js';


export function createTheme(mode = 'light') {

  const initialTheme = {
    colorSchemes,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
  };


  const selectedPalette = colorSchemes[mode]?.palette;
  return extendTheme({
    ...initialTheme,
    palette: selectedPalette,
  });
}

function shouldSkipGeneratingVar(keys, value) {
  const skipGlobalKeys = [
    'mixins',
    'overlays',
    'direction',
    'typography',
    'breakpoints',
    'transitions',
    'cssVarPrefix',
    'unstable_sxConfig',
  ];

  const skipPaletteKeys = {
    global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
    grey: ['A100', 'A200', 'A400', 'A700'],
    text: ['icon'],
  };

  const isPaletteKey = keys[0] === 'palette';

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;
    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}