import { Program, Mesh } from 'ogl';
import { gsap } from 'gsap';

import vertex from 'shaders/collections-vertex.glsl';
import fragment from 'shaders/collections-fragment.glsl';

export default class Media {
  constructor({ element, index, gl, geometry, scene, sizes }) {
    this.element = element;
    this.index = index;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;

    this.extra = 0;
    this.opacity = {
      current: 0,
      target: 0,
      multiplier: 0,
      lerp: 0.1,
    };

    this.createTexture();
    this.createProgram();
    this.createMesh();
    this.createBounds();
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
    gsap.fromTo(this.opacity, { multiplier: 0 }, { multiplier: 1 });
  }

  hide() {
    gsap.to(this.opacity, { multiplier: 0 });
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
  update({ scroll, index }) {
    if (!this.bounds) return;

    this.updateX(scroll);

    const amplitude = 0.1;
    const frequency = 1;

    this.mesh.rotation.z = -0.02 * Math.PI * Math.sin(this.index / frequency);
    this.mesh.position.y = amplitude * Math.sin(this.index / frequency);

    this.opacity.target = index === this.index ? 1 : 0.4;
    this.opacity.current = gsap.utils.interpolate(
      this.opacity.current,
      this.opacity.target,
      this.opacity.lerp
    );

    this.program.uniforms.uAlpha.value =
      this.opacity.multiplier * this.opacity.current;
  }
}
