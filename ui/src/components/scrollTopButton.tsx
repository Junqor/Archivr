import { Button } from "./ui/button";
import { scrollToTop } from "@/utils/scrollToTop";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const ScrollTopButton = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => {
  const [scrollPosition, setScrollPosition] = useState(window.scrollY);

  const updatePosition = useDebouncedCallback(() => {
    setScrollPosition(window.scrollY);
  }, 250);

  useEffect(() => {
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return (
    <Button
      className={cn(
        scrollPosition < 50 && "hidden",
        "rounded-full border border-white/75 bg-gray-secondary p-0 md:hover:bg-gray-secondary/75",
        className,
      )}
      onClick={scrollToTop}
      {...props}
    >
      {children}
    </Button>
  );
};
