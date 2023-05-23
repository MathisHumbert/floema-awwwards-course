import each from 'lodash/each';
import { gsap } from 'gsap';
import Prefix from 'prefix';
import normalizeWheel from 'normalize-wheel';
import map from 'lodash/map';

import Title from 'animations/Title';
import Paragraph from 'animations/Paragraph';
import Label from 'animations/Label';
import Highlight from 'animations/Highlight';
export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsHighlights: '[data-animation="highlight"]',
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
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

  show() {
    return new Promise((resolve) => {
      this.animationIn = gsap.timeline();

      this.animationIn
        .fromTo(
          this.element,
          { autoAlpha: 0, duration: 0 },
          {
            autoAlpha: 1,
            onComplete: resolve,
          }
        )
        .call(() => {
          this.addEventListeners();
          resolve();
        });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeEventListeners();

      this.animationOut = gsap.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    const { pixelY } = normalizeWheel(event);

    this.scroll.target += pixelY;
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, (animation) => animation.onResize());
  }

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

  addEventListeners() {
    window.addEventListener('wheel', this.onMouseWheel.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener('wheel', this.onMouseWheel.bind(this));
  }
}
