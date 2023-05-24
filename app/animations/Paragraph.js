import { gsap } from 'gsap';
import each from 'lodash/each';

import Animation from 'classes/Animation';
import { split, calculate } from 'utils/text';

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    this.elementLinesSpans = split({
      element: this.element,
    });
  }

  animateIn() {
    each(this.elementLines, (line, index) => {
      gsap.fromTo(
        line,
        { y: '100%', autoAlpha: 0 },
        {
          y: '0%',
          autoAlpha: 1,
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
