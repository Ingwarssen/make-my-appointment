module.exports = (req, res, next) => {
  req.isMobile = true;

  next();
};
