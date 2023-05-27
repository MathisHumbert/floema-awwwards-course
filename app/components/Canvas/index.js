import { Renderer, Camera, Transform } from 'ogl';

import Home from 'components/Canvas/Home';

export default class Canvas {
  constructor() {
    this.x = {
      start: 0,
      distance: 0,
      end: 0,
    };
    this.y = { start: 0, distance: 0, end: 0 };

    this.createRenderer();
    this.createCamera();
    this.createScene();

    this.onResize();

    this.createHome();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
    });
    this.gl = this.renderer.gl;
    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    this.home = new Home({ gl: this.gl, scene: this.scene, sizes: this.sizes });
  }

  /**
   * Events.
   */
  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      width,
      height,
    };

    if (this.home && this.home.onResize) {
      this.home.onResize({ sizes: this.sizes });
    }
  }

  onTouchDown(event) {
    this.isDown = true;

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX;
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.home && this.home.onTouchDown) {
      this.home.onTouchDown();
    }
  }

  onTouchMove(event) {
    if (!this.isDown) return;

    this.x.end = event.touches ? event.touches[0].clientX : event.clientX;
    this.y.end = event.touches ? event.touches[0].clientY : event.clientY;

    this.x.distance = this.x.start - this.x.end;
    this.y.distance = this.y.start - this.y.end;

    if (this.home && this.home.onTouchMove) {
      this.home.onTouchMove({ x: this.x, y: this.y });
    }
  }

  onTouchUp() {
    this.isDown = false;
  }

  onWheel(event) {
    if (this.home && this.home.onWheel) {
      this.home.onWheel(event);
    }
  }

  /**
   * Loop.
   */
  update() {
    this.renderer.render({ scene: this.scene, camera: this.camera });

    if (this.home && this.home.update) {
      this.home.update();
    }
  }
}
