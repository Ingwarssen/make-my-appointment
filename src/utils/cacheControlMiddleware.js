module.exports = (req, res, next) => {
  const browser = req.headers['user-agent']

  if (/Trident/.test(browser) || /Edge/.test(browser)) {
    res.header(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    )
  }

  next()
}
