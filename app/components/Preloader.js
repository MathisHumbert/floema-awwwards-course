import each from 'lodash/each';
import { gsap } from 'gsap';

import Component from 'classes/Component';
import { split } from 'utils/text';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        numberText: '.preloader__number__text',

        images: document.querySelectorAll('img'),
      },
    });

    split({
      element: this.elements.title,
      expression: '<br>',
    });

    split({
      element: this.elements.title,
      expression: '<br>',
    });

    this.elements.titleSpans =
      this.elements.title.querySelectorAll('span span');

    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      element.src = element.getAttribute('data-src');
      element.onload = () => this.onAssetLoaded(element);
    });
  }

  // custom image loaded
  onAssetLoaded(image) {
    this.length += 1;

    const percent = this.length / this.elements.images.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  // once all images are loaded
  onLoaded() {
    this.animateOut = gsap.timeline({
      delay: 1,
      defaults: { duration: 1.5, ease: 'expo.out' },
    });

    this.animateOut
      .to(this.elements.titleSpans, {
        y: '100%',

        stagger: 0.1,
      })
      .to(
        this.elements.numberText,
        {
          y: '100%',
        },
        '-=1.4'
      )
      .to(
        this.element,
        {
          scaleY: 0,
          transformOrigin: '0 100%',
        },
        '-=1'
      )
      .call(() => {
        this.emit('completed');
      });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
