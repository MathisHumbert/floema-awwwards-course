import { gsap } from 'gsap';

import Component from 'classes/Component';
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from 'utils/color';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link',
      },
    });

    this.onChange(template);
  }

  onChange(template) {
    console.log(template);
    if (template === 'about') {
      gsap.to(this.element, {
        color: COLOR_BRIGHT_GRAY,
        duration: 0.75,
      });

      gsap.to(this.elements.items[1], { autoAlpha: 0, duration: 0.75 });

      gsap.to(this.elements.items[0], {
        autoAlpha: 1,
        duration: 0.75,
        delay: 0.75,
      });
    } else {
      gsap.to(this.element, {
        color: COLOR_QUARTER_SPANISH_WHITE,
        duration: 1.5,
      });

      gsap.to(this.elements.items[0], { autoAlpha: 0, duration: 0.75 });

      gsap.to(this.elements.items[1], {
        autoAlpha: 1,
        duration: 0.75,
        delay: 0.75,
      });
    }
  }
}
