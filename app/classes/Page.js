import each from 'lodash/each';
import { gsap } from 'gsap';
import Prefix from 'prefix';
import map from 'lodash/map';

import Title from 'animations/Title';
import Paragraph from 'animations/Paragraph';
import Label from 'animations/Label';
import Highlight from 'animations/Highlight';

import { ColorsManager } from 'classes/Colors';
import AsyncLoad from 'classes/AsyncLoad';
export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsHighlights: '[data-animation="highlight"]',
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
      preloaders: '[data-src]',
    };
    this.id = id;

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    this.transformPrefix = Prefix('transform');
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
    this.createPreloader();
  }

  createAnimations() {
    this.animations = [];

    // Highlights
    this.animationsHighlights = map(
      this.elements.animationsHighlights,
      (element) => {
        return new Highlight({ element });
      }
    );

    // Titles
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({ element });
    });

    // Paragraphs
    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({ element });
      }
    );

    // Labels
    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({ element });
    });

    this.animations.push(
      ...this.animationsTitles,
      ...this.animationsParagraphs,
      ...this.animationsLabels
    );
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }

  // Animations
  show(animation) {
    return new Promise((resolve) => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color'),
      });

      if (animation) {
        this.animationIn = animation;
      } else {
        this.animationIn = gsap.timeline();

        this.animationIn.fromTo(
          this.element,
          { autoAlpha: 0, duration: 0 },
          {
            autoAlpha: 1,
          }
        );
      }

      this.animationIn.call(() => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();

      this.animationOut = gsap.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  // Destroy
  destroy() {
    this.removeEventListeners();
  }

  // Events
  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, (animation) => animation.onResize());
  }

  // Loop
  update() {
    // limit the scroll to top and bottom of the page
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    // lerp the scroll
    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;

      // gsap.to(this.elements.wrapper, { y: -this.scroll.current });
    }
  }

  // Listeners
  addEventListeners() {
    // window.addEventListener('wheel', this.onMouseWheel.bind(this));
  }

  removeEventListeners() {
    // window.removeEventListener('wheel', this.onMouseWheel.bind(this));
  }
}
