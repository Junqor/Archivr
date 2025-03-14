import React from "react";

export const BurgerIcon = ({
  open,
  ...props
}: { open: boolean } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`relative inline-block cursor-pointer rounded-full shadow-md transition-transform`}
    {...props}
  >
    <div
      className={`h-[2px] w-6 rounded-md bg-white transition-transform ${
        open ? "translate-y-[6px] rotate-[-45deg]" : ""
      }`}
    />
    <div
      className={`my-[4px] h-[2px] w-6 rounded-md bg-white transition-opacity ${
        open ? "opacity-0" : "opacity-100"
      }`}
    />
    <div
      className={`h-[2px] w-6 rounded-md bg-white transition-transform ${
        open ? "translate-y-[-6px] rotate-[45deg]" : ""
      }`}
    />
  </div>
);
