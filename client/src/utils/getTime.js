export const getTime = (time) => {
  if (!time || time < 0) return "0м";
  const days = Math.floor(time / 60 / 24);
  const hours = Math.floor((time - days * 60 * 24) / 60);
  const minutes = Math.floor(time - hours * 60 - days * 60 * 24);

  return `${days ? `${days}д ` : ""}${hours ? `${hours}ч ` : ""}${
    minutes ? `${minutes}м` : ""
  }`;
};

export const getTimePlanned = (time) => {
  const timeArr = time.trim().split(" ");
  return timeArr.reduce((acc, item) => {
    if (item.includes("ч")) {
      return acc + parseInt(item) * 60;
    }
    if (item.includes("м")) {
      return acc + parseInt(item);
    }
    if (item.includes("д")) {
      return acc + parseInt(item) * 60 * 24;
    }
  }, 0);
};

