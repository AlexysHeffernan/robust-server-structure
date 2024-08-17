const uses = require("../data/uses-data");

function list(req, res) {
    const { urlId } = req.params;
  if (urlId) {
    res.json({ data: uses.filter(use => use.urlId == urlId) });
  } else {
    res.json({ data: uses });
  }
}

function useExists(req, res, next) {
  const { urlId, useId } = req.params;
  let foundUse;
  if (urlId) {
    foundUse = uses.find((use) => use.id === Number(useId) && use.urlId === Number(urlId));
  } else {
    foundUse = uses.find((use) => use.id === Number(useId));
  }

  if (foundUse) {
    res.locals.use = foundUse;
    return next();
  }

  next({
    status: 404,
    message: `Use id not found${urlId ? ` for url id ${urlId}` : ''}: ${useId}`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.use });
}

function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.findIndex(use => use.id === Number(useId));
  if (index > -1) {
    uses.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [useExists, read],
  delete: [useExists, destroy],
};