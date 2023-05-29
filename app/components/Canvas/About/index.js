import { Plane, Transform } from 'ogl';
import { each, map } from 'lodash';

import Gallery from './Gallery';

export default class About {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;

    this.group = new Transform();
    this.group.setParent(scene);

    this.createGeometry();
    this.createGalleries();
    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      widthSegments: 10,
      heightSegments: 10,
    });
  }

  createGalleries() {
    this.galleriesElement = document.querySelectorAll('.about__gallery');

    this.galleries = map(this.galleriesElement, (element, index) => {
      return new Gallery({
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
    each(this.galleries, (element) => element.show());
  }

  hide() {
    each(this.galleries, (element) => element.hide());
  }

  /**
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;

    each(this.galleries, (element) => element.onResize({ sizes }));
  }

  onTouchDown() {
    each(this.galleries, (element) => element.onTouchDown());
  }

  onTouchMove({ x }) {
    each(this.galleries, (element) =>
      element.onTouchMove({ distance: x.distance })
    );
  }

  onWheel({ pixelY }) {
    each(this.galleries, (element) => element.onWheel({ pixelY }));
  }

  /**
   * Loop.
   */
  update(scroll) {
    each(this.galleries, (element) => {
      element.update(scroll);
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    each(this.galleries, (element) => element.destroy());
  }
}
