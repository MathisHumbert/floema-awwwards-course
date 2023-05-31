require('dotenv').config();

const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uaParser = require('ua-parser-js');
const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

const app = express();
const port = 3000;

app.use(errorHandler());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'dist')));

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};

// Link Resolver
const HandleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`;
  }
  if (doc.type === 'about') {
    return `/about`;
  }
  if (doc.type === 'collections') {
    return '/collections';
  }

  return '/';
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  const ua = uaParser(req.headers['user-agent']);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isTablet = ua.device.type === 'tablet';
  res.locals.isPhone = ua.device.type === 'mobile';

  res.locals.PrismicH = PrismicH;
  res.locals.Link = HandleLinkResolver;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const handleRequest = async (api) => {
  const meta = await api.getSingle('meta');
  const preloader = await api.getSingle('preloader');
  const navigation = await api.getSingle('navigation');
  const home = await api.getSingle('home');
  const collections = await api.getAllByType('collection', {
    fetchLinks: 'product.image',
  });
  const about = await api.getSingle('about');

  let assets = [];

  home.data.gallery.forEach((item) => assets.push(item.image.url));

  about.data.gallery.forEach((item) => assets.push(item.image.url));

  about.data.body.forEach((section) => {
    if (section.slice_type === 'gallery') {
      section.items.forEach((item) => assets.push(item.image.url));
    }
  });

  collections.forEach((collection) => {
    collection.data.products.forEach((item) =>
      assets.push(item.products_product.data.image.url)
    );
  });

  return { assets, meta, preloader, navigation, home, collections, about };
};

app.get('/', async (req, res) => {
  const api = initApi(req);

  const defaults = await handleRequest(api);

  res.render('pages/home', { ...defaults });
});

app.get('/about', async (req, res) => {
  const api = initApi(req);

  const defaults = await handleRequest(api);

  res.render('pages/about', { ...defaults });
});

app.get('/detail/:id', async (req, res) => {
  const api = initApi(req);

  const defaults = await handleRequest(api);
  const product = await api.getByUID('product', 'silver-necklace', {
    fetchLinks: 'collection.title',
  });

  res.render('pages/detail', { ...defaults, product });
});

app.get('/collections', async (req, res) => {
  const api = initApi(req);

  const defaults = await handleRequest(api);

  res.render('pages/collections', { ...defaults });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
