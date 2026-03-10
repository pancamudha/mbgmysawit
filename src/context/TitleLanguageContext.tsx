"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Hanya 2 bahasa: English & Romaji (disebut JP di UI)
export type Language = 'english' | 'romaji';

interface TitleLanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const TitleLanguageContext = createContext<TitleLanguageContextType | undefined>(undefined);

export function TitleLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english');

  useEffect(() => {
    const savedLang = localStorage.getItem('animaple_title_lang') as Language;
    if (savedLang === 'english' || savedLang === 'romaji') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('animaple_title_lang', newLang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'romaji' : 'english');
  };

  return (
    <TitleLanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </TitleLanguageContext.Provider>
  );
}

export function useTitleLanguage() {
  const context = useContext(TitleLanguageContext);
  if (context === undefined) {
    throw new Error('useTitleLanguage must be used within a TitleLanguageProvider');
  }
  return context;
}

// ============================================================================
// HOOK SUPER PENTING: Untuk mendapatkan judul anime berdasarkan bahasa
// ============================================================================
export function useAnimeTitle() {
  const { language } = useTitleLanguage();

  const getTitle = (title?: string, japaneseTitle?: string) => {
    if (language === 'romaji') {
      return japaneseTitle && japaneseTitle.trim() !== '' ? japaneseTitle : (title || 'Unknown Title');
    }
    return title || japaneseTitle || 'Unknown Title';
  };

  return { getTitle };
}