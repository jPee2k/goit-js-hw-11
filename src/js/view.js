import { Notify } from 'notiflix/build/notiflix-notify-aio';
import photoCard from '../templates/photoCard.hbs';

Notify.init({
  width: '300px',
  position: 'center-center',
  timeout: 2000,
  cssAnimation: true,
  clickToClose: true,
  pauseOnHover: false,
  backOverlay: true,
  backOverlayColor: 'rgba(0,0,0,0.2)',
});

export const renderImages = (container, images) => {
  const cards = images.map(photoCard);
  container.insertAdjacentHTML('beforeend', cards.join('\n'));
};

export const renderNotify = (state = 'success', itemsCount = null) => {
  if (itemsCount === 0) {
    Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  switch (state) {
    case 'success':
      Notify.success(`Hooray! We found ${itemsCount} images.`);
      break;
    case 'error':
      Notify.failure('Oops, Something went wrong, please, try again.');
      break;
    default:
      throw new Error(`Unknown state: ${state}`);
  }
};

export const clearPage = (form, gallery, button) => {
  button.hide();
  form.reset();
  gallery.innerHTML = '';
};

export const scrollToNextRow = (gallery) => {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
