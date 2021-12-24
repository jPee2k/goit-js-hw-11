import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './countries-api.js';

import countryCard from '../templates/countryCard.hbs';
import listOfCountries from '../templates/listOfCountries.hbs';

const DEBOUNCE_DELAY = 300;
const MAX_RENDERED_COUNTRIES_COUNT = 10;
const FULL_RENDERED_COUNTRIES_COUNT = 1;

export default () => {
  const elements = {
    search: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
  };

  const onSearchInput = (evt) => {
    evt.preventDefault();
    clearSearchResults(elements);
    const value = evt.target.value.trim();

    if (!value) {
      return;
    }
    addSpinner(elements.search);

    fetchCountries(value)
      .then((data) => {
        callNotify(data);
        removeSpinner(elements.search);
        renderCountriesData(elements, data);
      })
      .catch(() => {
        Notify.failure('Sorry, but there are no results for your search');
        removeSpinner(elements.search);
      });
  };

  elements.search.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));
};

function renderCountriesData({ search, list, info }, data) {
  const countriesCount = data.length;

  if (countriesCount === FULL_RENDERED_COUNTRIES_COUNT) {
    info.innerHTML = countryCard(data[0]);
  } else if (countriesCount > FULL_RENDERED_COUNTRIES_COUNT && countriesCount <= MAX_RENDERED_COUNTRIES_COUNT) {
    list.innerHTML = listOfCountries(data);
  }
}

function callNotify({ length: countriesCount } = 0) {
  if (countriesCount > MAX_RENDERED_COUNTRIES_COUNT) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    Notify.info(`${countriesCount} matches found for your request`);
  }
}

function clearSearchResults(elements) {
  elements.list.innerHTML = '';
  elements.info.innerHTML = '';
}

function addSpinner(el) {
  const spinner = el.parentElement.querySelector('.spinner');
  spinner && spinner.classList.add('spinner--shown');
}

function removeSpinner(el) {
  const spinner = el.parentElement.querySelector('.spinner');
  spinner && spinner.classList.remove('spinner--shown');
}
