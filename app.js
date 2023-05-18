require('dotenv').config();

const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const errorHandler = require('errorhandler');
const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

const app = express();
const port = 3000;

app.use(errorHandler());

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
  // if (doc.type === 'product') {
  //   return `/detail/${doc.slug}`;
  // }
  // if (doc.type === 'about') {
  //   return `/about`;
  // }
  // if (doc.type === 'collections') {
  //   return '/collections';
  // }

  return '/';
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.PrismicH = PrismicH;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  const api = initApi(req);
  const data = await api.getSingle('home');
  console.log(PrismicH);
  res.render('pages/home');
});

app.get('/about', async (req, res) => {
  const api = initApi(req);

  const about = await api.getSingle('about');
  const meta = await api.getSingle('meta');

  res.render('pages/about', { about, meta });
});

app.get('/detail/:id', async (req, res) => {
  const api = initApi(req);

  const meta = await api.getSingle('meta');

  const product = await api.getByUID('product', 'silver-necklace', {
    fetchLinks: 'collection.title',
  });
  console.log(product.data);
  res.render('pages/detail', { meta, product });
});

app.get('/collections', (req, res) => {
  res.render('pages/collections');
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
