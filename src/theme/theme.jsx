import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light' ? lightPalette : darkPalette),
    },
});