import { Plane, Transform } from 'ogl';
import { gsap } from 'gsap';
import { each, map } from 'lodash';

import Media from 'components/Canvas/Media';

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;

    this.galleryElement = document.querySelector('.home__gallery');
    this.mediasElements = document.querySelectorAll(
      '.home__gallery__media__image'
    );

    this.group = new Transform();
    this.group.setParent(scene);

    this.x = { current: 0, target: 0, lerp: 0.1, direction: '' };
    this.y = { current: 0, target: 0, lerp: 0.1, direction: '' };
    this.scroll = { x: 0, y: 0 };
    this.scrollCurrent = { x: 0, y: 0 };

    this.createGeometry();
    this.createGallery();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      widthSegments: 10,
      heightSegments: 10,
    });
  }

  createGallery() {
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
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;

    const galleryBounds = this.galleryElement.getBoundingClientRect();

    this.gallerySizes = {
      width: (galleryBounds.width / window.innerWidth) * this.sizes.width,
      height: (galleryBounds.height / window.innerHeight) * this.sizes.height,
    };

    each(this.medias, (element) => element.onResize({ sizes }));
  }

  onTouchDown() {
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    this.x.target = this.scrollCurrent.x + x.distance;
    this.y.target = this.scrollCurrent.y + y.distance;
  }

  onWheel({ pixelY }) {
    this.y.target += pixelY;
  }

  /**
   * Loop.
   */
  update() {
    if (!this.gallerySizes) return;

    this.x.current = gsap.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );
    this.y.current = gsap.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    );

    if (this.scroll.x < this.x.current) {
      this.x.direction = 'left';
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'right';
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'bottom';
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'top';
    }

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    each(this.medias, (element) => {
      element.update({
        scroll: this.scroll,
        gallerySizes: this.gallerySizes,
        direction: { x: this.x.direction, y: this.y.direction },
      });
    });
  }
}
