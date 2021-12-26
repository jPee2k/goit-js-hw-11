import SimpleLightbox from 'simplelightbox';
import PixabayApiService from './PixabayApiService.js';
import Button from './Button.js';
import { renderImages, renderNotify, clearPage, scrollToNextRow } from './view.js';

import 'simplelightbox/dist/simple-lightbox.min.css';

export default () => {
  const elements = {
    searchForm: document.querySelector('#search-form'),
    searchInput: document.querySelector('#search-form input[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    scrollButton: document.querySelector('[data-button="search-form"]'),
  };

  const searchButton = new Button('#search-form button[type="submit"]');
  const loadMoreButton = new Button('[data-button="load-more"]', true);
  const pixabayService = new PixabayApiService({
    safesearch: false,
  });
  const lightbox = new SimpleLightbox('.gallery .photo-card', {
    captionDelay: 250,
  });

  let pageData = {};

  const onSearchFormSubmit = async (evt) => {
    evt.preventDefault();
    pixabayService.searchQuery = evt.target.elements.searchQuery.value.trim();

    if (!pixabayService.searchQuery) {
      return;
    }

    searchButton.disable();
    clearPage(evt.target, elements.gallery, loadMoreButton);

    try {
      const response = await pixabayService.fetchImages();
      pageData = pixabayService.getPagesInfo();
      renderNotify('success', pageData.totalHits);
      renderImages(elements.gallery, response.data.hits);
      lightbox.refresh();
      loadMoreButton.toggle(pageData);
    } catch (err) {
      renderNotify('error');
    } finally {
      searchButton.enable();
    }
  };

  const onLoadMoreClickButton = async (evt) => {
    evt.preventDefault();

    if (!pixabayService.searchQuery) {
      return;
    }

    loadMoreButton.disable().addLoader();
    try {
      const response = await pixabayService.incrementPage().fetchImages();
      pageData = pixabayService.getPagesInfo();
      renderImages(elements.gallery, response.data.hits);
      lightbox.refresh();
      scrollToNextRow(elements.gallery);
    } catch (err) {
      renderNotify('error');
    } finally {
      loadMoreButton.removeLoader().enable().toggle(pageData);
    }
  };

  const onScrollButtonClick = (evt) => {
    const elementID = evt.currentTarget.dataset.button;
    const el = document.querySelector(`#${elementID}`);
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  elements.searchForm.addEventListener('submit', onSearchFormSubmit);
  loadMoreButton.elements.button.addEventListener('click', onLoadMoreClickButton);
  elements.scrollButton.addEventListener('click', onScrollButtonClick);

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
    scrolled > coords && elements.scrollButton.classList.add('is-visible');
    scrolled < coords && elements.scrollButton.classList.remove('is-visible');
  });
};
