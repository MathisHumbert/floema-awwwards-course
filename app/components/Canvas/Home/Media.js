import { Program, Mesh } from 'ogl';

import vertex from 'shaders/home-vertex.glsl';
import fragment from 'shaders/home-fragment.glsl';
import { gsap } from 'gsap';

export default class Media {
  constructor({ element, index, gl, geometry, scene, sizes }) {
    this.element = element;
    this.index = index;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;

    this.extra = {
      x: 0,
      y: 0,
    };

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    const imageElement = this.element.querySelector('img');
    this.texture = window.TEXTURES[imageElement.getAttribute('data-src')];
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture },
        uViewPortSizes: { value: [this.sizes.width, this.sizes.height] },
        uSpeed: { value: 0 },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.mesh.setParent(this.scene);

    this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.02, Math.PI * 0.02);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  /**
   * Animations.
   */
  show() {
    gsap.fromTo(this.program.uniforms.uAlpha, { value: 0 }, { value: 0.4 });
  }

  hide() {
    gsap.to(this.program.uniforms.uAlpha, { value: 0 });
  }

  /**
   * Update.
   */
  updateScale() {
    this.mesh.scale.x =
      this.sizes.width * (this.bounds.width / window.innerWidth);
    this.mesh.scale.y =
      this.sizes.height * (this.bounds.height / window.innerHeight);
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / window.innerWidth) * this.sizes.width +
      this.extra.x;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / window.innerHeight) * this.sizes.height +
      this.extra.y;
  }

  /**
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;
    this.extra = {
      x: 0,
      y: 0,
    };

    this.program.uniforms.uViewPortSizes.value = [
      this.sizes.width,
      this.sizes.height,
    ];

    this.createBounds();
  }

  /**
   * Loop.
   */
  update({ scroll, gallerySizes, direction, speed }) {
    if (!this.bounds) return;

    this.program.uniforms.uSpeed.value = speed;

    this.updateX(scroll.x);
    this.updateY(scroll.y);

    const scaleX = this.mesh.scale.x / 2;
    const sizesX = this.sizes.width * 0.6;

    if (direction.x === 'left') {
      if (this.mesh.position.x + scaleX < -sizesX) {
        this.extra.x += gallerySizes.width;
        this.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.02,
          Math.PI * 0.02
        );
      }
    } else if (direction.x === 'right') {
      if (this.mesh.position.x - scaleX > sizesX) {
        this.extra.x -= gallerySizes.width;
        this.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.02,
          Math.PI * 0.02
        );
      }
    }

    const scaleY = this.mesh.scale.y / 2;
    const sizesY = this.sizes.height * 0.6;

    if (direction.y === 'top') {
      if (this.mesh.position.y + scaleY < -sizesY) {
        this.extra.y += gallerySizes.height;
        this.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.02,
          Math.PI * 0.02
        );
      }
    } else if (direction.y === 'bottom') {
      if (this.mesh.position.y - scaleY > sizesY) {
        this.extra.y -= gallerySizes.height;
        this.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.02,
          Math.PI * 0.02
        );
      }
    }
  }
}
