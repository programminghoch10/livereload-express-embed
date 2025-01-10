
import { embedLiveReload } from '..'
import express from 'express'


const app = express()
const httpServer = app.listen(8080, () => {
  console.log(`Server listening on port 8080`)
})

const liveReloadServer = embedLiveReload(app, httpServer)

liveReloadServer.watch('./index.html')
liveReloadServer.watch(import.meta.dirname)
