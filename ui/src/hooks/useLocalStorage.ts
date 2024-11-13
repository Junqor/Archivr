import { useState, useEffect } from "react";

export function useLocalStorage(key: string) {
  const [storedValue, setStoredValue] = useState<string | null>(() => {
    return localStorage.getItem(key);
  });

  const setValue = (value: string | null) => {
    localStorage.setItem(key, value || "");
    setStoredValue(value);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(localStorage.getItem(key));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
