import app from '@adonisjs/core/services/app'
import edge from 'edge.js'
import env from '#start/env'

const BASE_URL = new URL('../src/core/resources/', import.meta.url)

edge.mount(new URL('views', BASE_URL))

edge.global('app', {
  inDev: app.inDev,
  inProduction: app.inProduction,
})
edge.global('env', env)
