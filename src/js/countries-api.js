const BASE_URL = 'https://restcountries.com/v3.1/name/';
const FIELDS = ['name', 'capital', 'population', 'flags', 'languages'];

const fetchCountries = (countryName) => {
  const url = new URL(countryName, BASE_URL);
  url.searchParams.set('fields', FIELDS.join(','));

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};

export default fetchCountries;
