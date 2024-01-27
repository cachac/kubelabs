export const errorHandlers = async c => {
  console.error('📛 ERROR HANDLER 📛')
  console.error(c.error)

  c.status(c.error?.status || 500)

  if (!c.error) {
    console.log('error JSON stringify:')
    console.error(JSON.stringify(c, null, 2))
    console.log('error:')
    console.error(c)
  }

  return c.json({ ...c.error, ok: false })
}
