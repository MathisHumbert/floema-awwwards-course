import { Plane, Transform } from 'ogl';
import { gsap } from 'gsap';
import { each, map } from 'lodash';
import Prefix from 'prefix';

import Media from './Media';

export default class Collections {
  constructor({ gl, scene, sizes, transition }) {
    this.id = 'collections';
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.transition = transition;

    this.galleryElement = document.querySelector('.collections__gallery');
    this.galleryWrapperElement = document.querySelector(
      '.collections__gallery__wrapper'
    );
    this.mediasElements = document.querySelectorAll(
      '.collections__gallery__media'
    );
    this.collectionsElements = document.querySelectorAll(
      '.collections__article'
    );
    this.titlesElements = document.querySelector('.collections__titles');

    this.group = new Transform();
    this.group.setParent(this.scene);

    this.transformPrefix = Prefix('transform');

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      position: 0,
      limit: 1,
      lerp: 0.1,
    };
    this.direction = '';

    this.createGeometry();
    this.createGallery();

    this.onResize({ sizes });
    this.show();
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
   * Animations.
   */
  async show() {
    if (this.transition) {
      const { src } = this.transition.mesh.program.uniforms.tMap.value.image;
      const texture = window.TEXTURES[src];
      const media = this.medias.find((media) => media.texture === texture);
      const scroll =
        -media.bounds.left - media.bounds.width / 2 + window.innerWidth / 2;

      this.transition.animate(
        {
          position: { x: 0, y: media.mesh.position.y, z: 0 },
          rotation: media.mesh.rotation,
          scale: media.mesh.scale,
        },
        () => {
          media.opacity.multiplier = 1;

          map(this.medias, (item) => {
            if (media !== item) {
              item.show();
            }
          });

          this.scroll.current =
            this.scroll.target =
            this.scroll.start =
            this.scroll.last =
              scroll;
        }
      );
    } else {
      map(this.medias, (media) => media.show());
    }
  }

  hide() {
    each(this.medias, (element) => element.hide());
  }

  /**
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;

    this.scroll.limit =
      this.galleryWrapperElement.clientWidth -
      this.medias[0].element.clientWidth;

    each(this.medias, (element) => element.onResize({ sizes }));
  }

  onTouchDown() {
    this.scroll.position = this.scroll.current;
  }

  onTouchMove({ x }) {
    this.scroll.target = this.scroll.position + x.distance;
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  onChange(index) {
    this.index = index;

    const selectedCollection = Number(
      this.mediasElements[index].getAttribute('data-index')
    );

    each(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add('collections__article--active');
      } else {
        element.classList.remove('collections__article--active');
      }
    });

    this.titlesElements.style[this.transformPrefix] = `translateY(${
      25 * selectedCollection
    }%) translate(-50%, 50%) rotate(-90deg)`;

    this.media = this.medias[index];
  }

  /**
   * Loop.
   */
  update() {
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    this.galleryElement.style[
      this.transformPrefix
    ] = `translateX(-${this.scroll.current}px)`;

    this.scroll.last = this.scroll.current;

    const index = Math.floor(
      Math.abs(
        (this.scroll.current + this.medias[0].bounds.width / 2) /
          this.scroll.limit
      ) *
        (this.medias.length - 1)
    );

    if (this.index != index) {
      this.onChange(index);
    }

    this.index = index;

    each(this.medias, (element) => {
      element.update({
        scroll: this.scroll.current,
        index: this.index,
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
