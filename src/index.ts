import livereload from "connect-livereload"
import { Router } from "express"
import { createServer } from "livereload"
import { Server } from "node:http"
import { AddressInfo } from "node:net"
import { WebSocketServer } from "ws"

export function embedLiveReload(app: Router, httpServer: Server) {
  const liveReloadServer = createServer({
    noListen: true
  })
  liveReloadServer.server = new WebSocketServer({
    noServer: true
  })
  liveReloadServer.server.on('connection', liveReloadServer.onConnection.bind(liveReloadServer))
  liveReloadServer.server.on('close', liveReloadServer.onClose.bind(liveReloadServer))
  liveReloadServer.server.on('error', liveReloadServer.onError.bind(liveReloadServer))
  liveReloadServer.once("connection", () => {
    liveReloadServer.refresh("/")
  })
  app.use(livereload({
    port: (httpServer.address() as AddressInfo).port,
  }))
  app.get('/livereload.js', (req, res) => {
    res.status(200).sendFile(require.resolve('livereload-js'))
  })
  httpServer.on('upgrade', (req, socket, head) => {
    if (req.url !== '/livereload') return
    liveReloadServer.server.handleUpgrade(req, socket, head, (ws) => {
      liveReloadServer.server.emit('connection', ws, req)
    })
  })
  return liveReloadServer
}
