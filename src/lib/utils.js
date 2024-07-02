export const isDataStale = (lastFetchTime, maxAgeMinutes) => {
  const now = new Date();
  const lastFetch = new Date(lastFetchTime);
  const diffMs = now - lastFetch;
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins > maxAgeMinutes;
};

export const currencyMap = {
  "orzax-inc": "$",
  "orzax-ltd": "£",
  "orzax-spzoo": "PLN",
  "orzax-gmbh": "€",
};

export const getUniqueCategories = (categories) => {
  const uniqueCategories = [
    ...new Set(categories.map((category) => decodeHtml(category.name))),
  ];
  return uniqueCategories.join(", ");
};

export const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value.replace(/&amp;/g, "&");
};