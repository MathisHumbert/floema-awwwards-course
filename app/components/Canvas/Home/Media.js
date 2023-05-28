import { Program, Mesh, Texture } from 'ogl';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';
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
    this.texture = new Texture(this.gl);

    const imageElement = this.element.querySelector('img');

    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = imageElement.getAttribute('data-src');
    this.image.onload = () => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture },
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
    gsap.fromTo(this.program.uniforms.uAlpha, { value: 0 }, { value: 1 });
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

    this.createBounds();
  }

  /**
   * Loop.
   */
  update({ scroll, gallerySizes, direction }) {
    if (!this.bounds) return;

    this.updateX(scroll.x);
    this.updateY(scroll.y);

    const scaleX = this.mesh.scale.x / 2;
    const sizesX = this.sizes.width / 2;

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
    const sizesY = this.sizes.height / 2;

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
