import React from "react";

export const StarBadgeSVG = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ ...props }, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="51"
      viewBox="0 0 48 51"
      fill="none"
      {...props}
      ref={ref}
    >
      <path
        d="M24 0.25L29.7941 7.41769L38.6946 5.02457L39.1691 14.229L47.7764 17.5246L42.75 25.25L47.7764 32.9754L39.1691 36.271L38.6946 45.4754L29.7941 43.0823L24 50.25L18.2059 43.0823L9.30537 45.4754L8.83093 36.271L0.223587 32.9754L5.25 25.25L0.223587 17.5246L8.83093 14.229L9.30537 5.02457L18.2059 7.41769L24 0.25Z"
        fill="inherit"
      />
    </svg>
  );
});
