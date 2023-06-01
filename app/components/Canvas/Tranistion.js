import { Program, Mesh, Plane } from 'ogl';
import { gsap } from 'gsap';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Media {
  constructor({ url, gl, scene, sizes }) {
    this.url = url;
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.geometry = new Plane(this.gl);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: this.element.texture },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.scale.x = this.element.mesh.scale.x;
    this.mesh.scale.y = this.element.mesh.scale.y;
    this.mesh.scale.z = this.element.mesh.scale.z;

    this.mesh.position.x = this.element.mesh.position.x;
    this.mesh.position.y = this.element.mesh.position.y;
    this.mesh.position.z = this.element.mesh.position.z + 0.01;

    this.mesh.rotation.x = this.element.mesh.rotation.x;
    this.mesh.rotation.y = this.element.mesh.rotation.y;
    this.mesh.rotation.z = this.element.mesh.rotation.z;

    this.mesh.setParent(this.scene);
  }

  setElement(element) {
    if (element.id === 'collections') {
      const { index, medias } = element;

      this.element = medias[index];

      this.transition = 'detail';
    } else {
      this.element = element;

      this.transition = 'collection';
    }

    this.createProgram();
    this.createMesh();
  }

  /**
   * Animations.
   */
  animate(element, onComplete) {
    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: 'expo.inOut' },
    });

    tl.to(this.mesh.position, {
      x: element.position.x,
      y: element.position.y,
      z: element.position.z,
    })
      .to(
        this.mesh.scale,
        {
          x: element.scale.x,
          y: element.scale.y,
          z: element.scale.z,
        },
        0
      )
      .to(
        this.mesh.rotation,
        {
          x: element.rotation.x,
          y: element.rotation.y,
          z: element.rotation.z,
        },
        0
      )
      .call(() => onComplete())
      .call(() => this.scene.removeChild(this.mesh), null, '+=0.2');
  }
}
