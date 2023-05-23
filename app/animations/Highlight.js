import { gsap } from 'gsap';
import each from 'lodash/each';

import Animation from 'classes/Animation';

export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    gsap.fromTo(
      this.element,
      { scale: 1.2, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.5,
        delay: 0.5,
        ease: 'expo.out',
      }
    );
  }

  animateOut() {
    gsap.set(this.element, { autoAlpha: 0 });
  }

  onResize() {}
}
