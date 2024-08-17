const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function list(req, res) {
  res.json({ data: urls });
}

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find(url => url.id === Number(urlId));
  if (foundUrl ) {
    res.locals.url = foundUrl;
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`,
  });
};

function read(req, res) {
  const { urlId } = req.params;
  const use = {
    id: uses.length + 1,
    urlId: Number(urlId),
    time: Date.now(),
  };
  uses.push(use);
  res.json({ data: res.locals.url });
};

let lastUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0)

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include ${propertyName}` });
    };
  }

function create(req, res) {
  const { data: { href  } = {} } = req.body;
  const newUrl = {
    id: ++lastUrlId, // Increment last id then assign as the current ID
    href,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function update(req, res) {
  const foundUrl = res.locals.url;
  const { data: { href } = {} } = req.body;
  foundUrl.href = href;
  res.json({ data: foundUrl });
}

module.exports = {
    create: [
    bodyDataHas("href"),
    create
],
  list,
  read: [urlExists, read],
  update: [urlExists, bodyDataHas("href"), update],
  urlExists,
};