import { Program, Mesh, Texture } from 'ogl';

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

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = this.element.getAttribute('data-src');
    this.image.onload = () => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
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
    this.mesh.position.x += this.index * this.mesh.scale.x;
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
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
      ((this.bounds.left - x) / window.innerWidth) * this.sizes.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / window.innerHeight) * this.sizes.height;
  }

  /**
   * Events.
   */
  onResize({ sizes }) {
    this.sizes = sizes;

    this.createBounds();
  }

  /**
   * Loop.
   */
  update(scroll) {
    if (!this.bounds) return;

    this.updateX(scroll.x);
    this.updateY(scroll.y);
  }
}
