import { gsap } from 'gsap';

import Component from 'classes/Component';

export default class Button extends Component {
  constructor({ element }) {
    super({ element });

    this.path = element.querySelector('path:last-child');
    this.pathLength = this.path.getTotalLength();

    this.timeline = gsap.timeline({ paused: true });

    this.timeline.fromTo(
      this.path,
      {
        strokeDashoffset: this.pathLength,
        strokeDasharray: `${this.pathLength} ${this.pathLength}`,
      },
      {
        strokeDashoffset: 0,
        strokeDasharray: `${this.pathLength} ${this.pathLength}`,
      }
    );
  }

  onMouseEnter() {
    this.timeline.play();
  }

  onMouseLeave() {
    this.timeline.reverse();
  }

  addEventListeners() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));

    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  removeEventListeners() {
    this.element.removeEventListener(
      'mouseenter',
      this.onMouseEnter.bind(this)
    );

    this.element.removeEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    );
  }
}
