import { Program, Mesh, Plane } from 'ogl';
import { gsap } from 'gsap';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Detail {
  constructor({ gl, scene, sizes, transition }) {
    this.id = 'detail';
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.transition = transition;

    this.element = document.querySelector('.detail__media');

    this.geometry = new Plane(this.gl);

    this.createTexture();
    this.createProgram();
    this.createMesh();
    this.createBounds();

    this.show();
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

    this.mesh.rotation.z = Math.PI * 0.01;

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
    if (this.transition) {
      this.transition.animate(
        this.mesh,
        () => (this.program.uniforms.uAlpha.value = 1)
      );
    } else {
      gsap.fromTo(this.program.uniforms.uAlpha, { value: 0 }, { value: 1 });
    }
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

  updateX() {
    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      (this.bounds.left / window.innerWidth) * this.sizes.width;
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
    // this.updateY(scroll.current);
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.mesh);
  }
}
