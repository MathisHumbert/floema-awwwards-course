import { Renderer, Camera, Transform } from 'ogl';

import Home from 'components/Canvas/Home';
import About from 'components/Canvas/About';
import Collections from 'components/Canvas/Collections';
import Detail from 'components/Canvas/Detail';
import Transition from './Tranistion';
export default class Canvas {
  constructor({ template }) {
    this.template = template;

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

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({ gl: this.gl, scene: this.scene, sizes: this.sizes });
  }

  destroyHome() {
    if (!this.home) return;

    this.home.destroy();
    this.home = null;
  }

  /**
   * About.
   */
  createAbout() {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  destroyAbout() {
    if (!this.about) return;

    this.about.destroy();
    this.about = null;
  }

  /**
   * Collections.
   */
  createCollections() {
    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  destroyCollections() {
    if (!this.collections) return;

    this.collections.destroy();
    this.collections = null;
  }

  /**
   * Detail.
   */
  createDetail() {
    this.detail = new Detail({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  destroyDetail() {
    if (!this.detail) return;

    this.detail.destroy();
    this.detail = null;
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onChangeEnd(this.template);
  }

  onChangeStart(template, url) {
    if (this.home) {
      this.home.hide();
    }

    if (this.about) {
      this.about.hide();
    }

    if (this.collections) {
      this.collections.hide();
    }

    if (this.detail) {
      this.detail.hide();
    }

    this.isFromCollectionsToDetail =
      template === 'collections' && url.indexOf('detail') > -1;
    this.isFromDetailtoCollections =
      template === 'detail' && url.indexOf('collections') > -1;

    if (this.isFromCollectionsToDetail || this.isFromDetailtoCollections) {
      this.transition = new Transition({
        url,
        gl: this.gl,
        scene: this.scene,
        sizes: this.sizes,
      });

      this.transition.setElement(this.collections || this.detail);
    }
  }

  onChangeEnd(template) {
    if (template === 'home') {
      this.createHome();
    } else if (this.home) {
      this.destroyHome();
    }

    if (template === 'about') {
      this.createAbout();
    } else if (this.about) {
      this.destroyAbout();
    }

    if (template === 'collections') {
      this.createCollections();
    } else if (this.collections) {
      this.destroyCollections();
    }

    if (template === 'detail') {
      this.createDetail();
    } else if (this.detail) {
      this.destroyDetail();
    }

    this.template = template;

    this.onResize();
  }

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

    if (this.about && this.about.onResize) {
      this.about.onResize({ sizes: this.sizes });
    }

    if (this.collections && this.collections.onResize) {
      this.collections.onResize({ sizes: this.sizes });
    }

    if (this.detail && this.detail.onResize) {
      this.detail.onResize({ sizes: this.sizes });
    }
  }

  onTouchDown(event) {
    this.isDown = true;

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX;
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.home && this.home.onTouchDown) {
      this.home.onTouchDown();
    }

    if (this.about && this.about.onTouchDown) {
      this.about.onTouchDown();
    }

    if (this.collections && this.collections.onTouchDown) {
      this.collections.onTouchDown();
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

    if (this.about && this.about.onTouchMove) {
      this.about.onTouchMove({ x: this.x, y: this.y });
    }

    if (this.collections && this.collections.onTouchMove) {
      this.collections.onTouchMove({ x: this.x, y: this.y });
    }
  }

  onTouchUp() {
    this.isDown = false;

    if (this.home && this.home.onTouchUp) {
      this.home.onTouchUp();
    }
  }

  onWheel(event) {
    if (this.home && this.home.onWheel) {
      this.home.onWheel(event);
    }

    if (this.about && this.about.onWheel) {
      this.about.onWheel(event);
    }

    if (this.collections && this.collections.onWheel) {
      this.collections.onWheel(event);
    }
  }

  /**
   * Loop.
   */
  update(scroll) {
    this.renderer.render({ scene: this.scene, camera: this.camera });

    if (this.home && this.home.update) {
      this.home.update();
    }

    if (this.about && this.about.update) {
      this.about.update(scroll);
    }

    if (this.collections && this.collections.update) {
      this.collections.update(scroll);
    }

    if (this.detail && this.detail.update) {
      this.detail.update(scroll);
    }
  }
}
