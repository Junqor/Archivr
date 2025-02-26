export const formatDate = (date: any, locale: string = "en-US") => {
  const dateUTC = new Date(`${date}Z`);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateUTC);
};

export const formatDateYear = (date: any, locale: string = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(new Date(date));
};
