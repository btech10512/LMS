"use client";;
import { useEffect, useState } from 'react';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const LOCAL_STORAGE_KEY = 'usehooks-ts-dark-mode';

export function useDarkMode(options = {}) {
  const {
    defaultValue = false,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true,
    applyDarkClass = true,
  } = options;

  // Check if user prefers dark mode
  const getOSPreference = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(COLOR_SCHEME_QUERY).matches;
    }
    return defaultValue;
  };

  // Initialize state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    if (!initializeWithValue) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(localStorageKey);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${localStorageKey}":`, error);
    }

    return getOSPreference();
  });

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(localStorageKey, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error(`Error setting localStorage key "${localStorageKey}":`, error);
    }
  }, [isDarkMode, localStorageKey]);

  // Listen for OS preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    
    const handleChange = (e) => {
      const savedValue = window.localStorage.getItem(localStorageKey);
      if (savedValue === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [localStorageKey]);

  // Apply dark mode class to document
  useEffect(() => {
    if (typeof window === 'undefined' || !applyDarkClass) return;

    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode, applyDarkClass]);

  return {
    isDarkMode,
    toggle: () => setIsDarkMode(prev => !prev),
    enable: () => setIsDarkMode(true),
    disable: () => setIsDarkMode(false),
    set: (value) => setIsDarkMode(value),
  };
}