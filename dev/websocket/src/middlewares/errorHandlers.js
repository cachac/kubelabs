export const errorHandlers = (err, req, res, next) => {
  // logger
  console.error(`[${err.code}] ${err.userMessage || ''} [${err.message || '...'}]. (${req.originalUrl} - ${req.method} - ${req.ip})`)
  // user message
  err.message = req.app.get('env') === 'development' ? `${err.userMessage || ''} [${err.message || '...'}]` : err.userMessage
  // send response
  return res.status(err.status || 500).send({ errorCode: err.code, errorMessage: err.message })
}
