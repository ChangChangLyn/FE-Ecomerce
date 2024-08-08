import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
  const [valueDeboune, setValueDebounce] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      setValueDebounce(value);
    }, delay);
    return () => {
      clearTimeout(handle);
    };
  }, [value, delay]);
  return valueDeboune;
};
