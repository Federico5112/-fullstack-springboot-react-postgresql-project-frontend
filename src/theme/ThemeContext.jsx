import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from './theme';

// 1. Context'in oluşturulması (IDE otomatik tamamlama yapsın diye boş bir fonksiyon veriyoruz)
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// 2. Custom Hook: Diğer dosyalardan tek satırla temayı değiştirebilmek için
export const useColorMode = () => useContext(ColorModeContext);

// 3. Provider Bileşeni: Uygulamayı sarmalayacak ana yapı
export const ThemeContextProvider = ({ children }) => {

    // Rasyonel Yaklaşım: Temayı ilk açılışta localStorage'dan oku
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode ? savedMode : 'light';
    });

    // Tema değiştirme mantığı
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode); // Değişikliği kalıcı yap
                    return newMode;
                });
            },
        }),
        []
    );

    // Sadece mod (light/dark) değiştiğinde temayı yeniden hesapla (Performans)
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Arka planı ve temel yazı tiplerini temaya uygun sıfırlar */}
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};