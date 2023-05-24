import Page from 'classes/Page';
import Button from 'classes/Buttons';

export default class Detail extends Page {
  constructor() {
    super({
      id: 'detail',
      element: '.detail',
      elements: { wrapper: '.detail__wrapper', button: '.detail__button' },
    });
  }

  create() {
    super.create();

    this.link = new Button({ element: this.elements.button });

    this.link.addEventListeners();
  }

  destroy() {
    super.destroy();

    this.link.removeEventListeners();
  }
}
