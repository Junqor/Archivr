export const formatDate = (
  date: any,
  abreviated: boolean = false,
  locale: string = "en-US",
) => {
  const dateUTC = new Date(`${date}Z`);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateUTC.getTime()) / 1000);

  if (!abreviated) {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateUTC);
  } else {
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diffInSeconds < minute) {
      return "1m ago";
    }
    if (diffInSeconds < hour) {
      return `${Math.floor(diffInSeconds / minute)}m ago`;
    }
    if (diffInSeconds < day) {
      return `${Math.floor(diffInSeconds / hour)}hr ago`;
    }
    if (diffInSeconds < month) {
      return `${Math.floor(diffInSeconds / day)}d ago`;
    }
    if (diffInSeconds < year) {
      return `${Math.floor(diffInSeconds / month)}mo ago`;
    }
    return `${Math.floor(diffInSeconds / year)}y ago`;
  }
};

export const formatDateYear = (date: any, locale: string = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(new Date(date));
};
