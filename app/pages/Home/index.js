import Page from 'classes/Page';
import Button from 'classes/Buttons';
export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.home__link',
      },
    });
  }

  create() {
    super.create();

    this.link = new Button({ element: this.elements.link });

    this.link.addEventListeners();
  }

  destroy() {
    super.destroy();

    this.link.removeEventListeners();
  }
}
