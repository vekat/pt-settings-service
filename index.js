const db = require('quick.db')
const { Responder, Publisher } = require('cote')

const service = new Responder({
  name: `[${process.env.npm_package_name} service]`,
  key: 'settings'
})

const publisher = new Publisher({
  name: `[${process.env.npm_package_name} publisher]`,
  key: 'settings'
})

service.on('get', ({ table, query }) => {
  let res
  try {
    res = db.get(query, { table })
  } catch (err) {
    return Promise.reject(err)
  }

  return Promise.resolve(res)
})

service.on('set', ({ table, query, value }) => {
  let res
  try {
    res = db.set(query, value, { table })
  } catch (err) {
    return Promise.reject(err)
  }

  publisher.publish(table, db.all({ table }))

  return Promise.resolve(res)
})

service.on('all', ({ table }) => {
  let res
  try {
    res = db.all({ table })
  } catch (err) {
    return Promise.reject(err)
  }

  return Promise.resolve(res)
})
