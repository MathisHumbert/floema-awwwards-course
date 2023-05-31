import { gsap } from 'gsap';

import Animation from 'classes/Animation';

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    this.element = element;
  }

  animateIn() {
    gsap.fromTo(
      this.element,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1, delay: 0.5 }
    );
  }

  animateOut() {
    gsap.set(this.element, { autoAlpha: 0 });
  }

  onResize() {}
}
