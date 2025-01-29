export const formatInteger = (number: number, locale: string = "en") => {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 3,
  }).format(number);
};
