import { Program, Mesh } from 'ogl';
import { gsap } from 'gsap';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Media {
  constructor({ element, index, gl, geometry, scene, sizes }) {
    this.element = element;
    this.index = index;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;

    this.extra = 0;

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
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.mesh.setParent(this.scene);
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
      this.extra;
  }

  updateY() {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      (this.bounds.top / window.innerHeight) * this.sizes.height;
  }

  updateRotation() {
    this.mesh.rotation.z = gsap.utils.mapRange(
      -this.sizes.width / 2,
      this.sizes.width / 2,
      Math.PI * 0.1,
      -Math.PI * 0.1,
      this.mesh.position.x
    );
  }

  /**
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;

    this.createBounds();
    this.extra = 0;
  }

  /**
   * Loop.
   */
  update({ scroll }) {
    if (!this.bounds) return;

    this.updateX(scroll);
  }
}
