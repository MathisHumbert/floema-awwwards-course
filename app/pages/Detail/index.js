import Page from 'classes/Page';
import Button from 'classes/Buttons';
import { gsap } from 'gsap';

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

  show() {
    const tl = gsap.timeline({ delay: 1.5 });

    tl.fromTo(
      this.element,
      { autoAlpha: 0, duration: 0 },
      {
        autoAlpha: 1,
      }
    );

    super.show(tl);
  }

  destroy() {
    super.destroy();

    this.link.removeEventListeners();
  }
}
