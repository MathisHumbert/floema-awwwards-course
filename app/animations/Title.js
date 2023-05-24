import { gsap } from 'gsap';
import each from 'lodash/each';

import Animation from 'classes/Animation';
import { split, calculate } from 'utils/text';

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    split({
      element: this.element,
    });

    split({
      element: this.element,
    });

    this.elementLinesSpans = this.element.querySelectorAll('span span');
  }

  animateIn() {
    gsap.set(this.elementLines, { autoAlpha: 1 });

    each(this.elementLines, (line, index) => {
      gsap.fromTo(
        line,
        { y: '100%' },
        {
          y: '0%',
          duration: 1.5,
          delay: 0.5 + index * 0.1,
          ease: 'expo.out',
        }
      );
    });
  }

  animateOut() {
    gsap.set(this.elementLines, { autoAlpha: 0 });
  }

  onResize() {
    this.elementLines = calculate(this.elementLinesSpans);
  }
}
