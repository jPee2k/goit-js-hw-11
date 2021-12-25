export default class Button {
  constructor(selector, isHidden = false) {
    this.elements = this.getElements(selector);
    isHidden && this.hide();
  }

  getElements(selector) {
    const elements = {};
    elements.button = document.querySelector(selector);
    elements.label = elements.button.querySelector('.label');
    elements.spinner = elements.button.querySelector('.spinner');

    return elements;
  }

  disable() {
    this.elements.button.disabled = true;
    return this;
  }

  enable() {
    this.elements.button.disabled = false;
    return this;
  }

  hide() {
    this.elements.button.classList.add('is-hidden');
    return this;
  }

  show() {
    this.elements.button.classList.remove('is-hidden');
    return this;
  }

  toggle({ page, count, totalHits } = {}) {
    if (count * page < totalHits) {
      return this.show();
    }

    return this.hide();
  }

  addLoader(text = '') {
    if (text && this.elements.label) {
      this.elements.label.textContent = text;
    }
    this.elements.button.classList.add('is-load');
    return this;
  }

  removeLoader(text = '') {
    if (text && this.elements.label) {
      this.elements.label.textContent = text;
    }
    this.elements.button.classList.remove('is-load');
    return this;
  }
}
