export const formatDate = (date: Date, locale: string = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const formatDateYear = (date: Date, locale: string = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(date);
};
