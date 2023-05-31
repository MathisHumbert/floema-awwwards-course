import { Texture } from 'ogl';
import each from 'lodash/each';
import { gsap } from 'gsap';

import Component from 'classes/Component';
import { split } from 'utils/text';

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        numberText: '.preloader__number__text',
      },
    });

    this.canvas = canvas;

    window.TEXTURES = {};

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
    each(window.ASSETS, (asset) => {
      const texture = new Texture(this.canvas.gl, { generateMipmaps: false });

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = asset;

      image.onload = () => {
        texture.image = image;
        this.onAssetLoaded();
      };

      window.TEXTURES[asset] = texture;
    });
  }

  // custom image loaded
  onAssetLoaded(image) {
    this.length += 1;

    const percent = this.length / window.ASSETS.length;

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
      onStart: () => {
        this.emit('completed');
      },
      onComplete: () => {
        this.destroy();
      },
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
          autoAlpha: 0,
          duration: 1,
        },
        '-=1'
      );
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
