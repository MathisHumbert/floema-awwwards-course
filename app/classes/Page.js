import each from 'lodash/each';
import { gsap } from 'gsap';

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = { ...elements };
    this.id = id;
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      console.log(entry, key);
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
  }

  show() {
    return new Promise((resolve) =>
      gsap.from(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      })
    );
  }

  hide() {
    return new Promise((resolve) =>
      gsap.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      })
    );
  }
}
