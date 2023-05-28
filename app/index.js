import { each } from 'lodash';
import normalizeWheel from 'normalize-wheel';

import About from 'pages/About';
import Collections from 'pages/Collections';
import Detail from 'pages/Detail';
import Home from 'pages/Home';

import Preloader from 'components/Preloader';
import Navigation from 'components/Navigation';
import Canvas from 'components/Canvas';

// TODO last video to watch when webgl is done

// to be used if we want to animate stuff different for mobile / tablet / desktop
// import DetectionManager from 'classes/Detections';

class App {
  constructor() {
    this.createContent();

    this.createPreloader();
    this.createNavigation();
    this.createCanvas();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  createNavigation() {
    this.navigation = new Navigation({ template: this.template });
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once('completed', this.onPreloaded.bind(this));
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  // create all pages and init acutal page
  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }

  // Events
  onPreloaded() {
    this.preloader.destroy();
    this.onResize();
    this.page.show();
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  // On page change catch next page html
  async onChange({ url, push = true }) {
    this.canvas.onChangeStart();
    await this.page.hide();

    console.log(url);
    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement('div');
      div.innerHTML = html;

      if (push) {
        window.history.pushState({}, '', url);
      }

      const divContent = div.querySelector('.content');
      this.template = divContent.getAttribute('data-template');

      this.navigation.onChange(this.template);

      this.content.innerHTML = divContent.innerHTML;
      this.content.setAttribute('data-template', this.template);

      this.canvas.onChangeEnd(this.template);

      this.page = this.pages[this.template];
      this.page.create();

      this.onResize();

      this.page.show();
      this.addLinkListeners();
    } else {
      console.log('error');
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }
  }

  onWheel(event) {
    const { pixelY } = normalizeWheel(event);

    if (this.page && this.page.onWheel) {
      this.page.onWheel({ pixelY });
    }

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel({ pixelY });
    }
  }

  update() {
    window.requestAnimationFrame(this.update.bind(this));

    if (this.page && this.page.update) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update();
    }
  }

  addEventListeners() {
    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));

    window.addEventListener('wheel', this.onWheel.bind(this));

    window.addEventListener('popstate', this.onPopState.bind(this));

    window.addEventListener('resize', this.onResize.bind(this));
  }

  // custom link event for page chage
  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      link.onclick = (e) => {
        e.preventDefault();

        this.onChange({ url: link.href, push: true });
      };
    });
  }
}

new App();
