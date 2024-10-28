import { useState, useEffect } from "react";

export function useLocalStorage(key: string) {
  const [storedValue, setStoredValue] = useState(() => {
    return localStorage.getItem(key);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(localStorage.getItem(key));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setStoredValue];
}
