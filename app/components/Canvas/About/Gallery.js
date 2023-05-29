import { Transform } from 'ogl';
import { each, map } from 'lodash';
import { gsap } from 'gsap';

import Media from './Media';

export default class Gallery {
  constructor({ element, gl, geometry, scene, sizes }) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;

    this.elementWrapper = this.element.querySelector(
      '.about__gallery__wrapper'
    );

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      position: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.group = new Transform();
    this.group.setParent(scene);

    this.createMedias();
  }

  createMedias() {
    this.mediasElements = this.element.querySelectorAll(
      '.about__gallery__media'
    );

    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        gl: this.gl,
        geometry: this.geometry,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  /**
   * Animations.
   */
  show() {
    each(this.medias, (element) => element.show());
  }

  hide() {
    each(this.medias, (element) => element.hide());
  }

  /**
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;

    const bounds = this.elementWrapper.getBoundingClientRect();

    this.width = (bounds.width / window.innerWidth) * this.sizes.width;

    each(this.medias, (element) => element.onResize({ sizes }));
  }

  onTouchDown() {
    this.scroll.position = this.scroll.current;
  }

  onTouchMove({ distance }) {
    this.scroll.target = this.scroll.position + distance;
  }

  onWheel({ pixelY }) {
    // this.y.target += pixelY;
  }

  /**
   * Loop.
   */
  update(scroll) {
    if (!this.width) return;

    const y = (scroll.current / window.innerHeight) * this.sizes.height;
    const distance = (scroll.current - scroll.target) * 0.1;

    this.group.position.y = y;

    this.scroll.target -= this.scroll.velocity + distance;

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'left';
      this.scroll.velocity = -1;
    } else if (this.scroll.current < this.scroll.last) {
      this.direction = 'right';
      this.scroll.velocity = 1;
    }

    this.scroll.last = this.scroll.current;

    each(this.medias, (element) => {
      element.update({
        scroll: this.scroll.current,
        galleryWidth: this.width,
        direction: this.direction,
      });
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.group);
  }
}
