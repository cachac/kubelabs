const { PubSub } = require('apollo-server-express')

const pubsub = new PubSub()

// pubsub.ee.setMaxListeners(20)

export { pubsub }
