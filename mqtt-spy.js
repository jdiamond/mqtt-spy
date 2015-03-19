#!/usr/bin/env node

var path = require('path')
var util = require('util')
var chalk = require('chalk')
var tcpSpy = require('tcp-spy')
var mqttPacket = require('mqtt-packet')

var args = process.argv.slice(2)

if (args.length < 2) {
  console.error('usage: %s <spy-port> [target-host] <target-port>', path.basename(process.argv[1]))
  process.exit(1)
}

var spyPort = +args[0]
var targetHost = args[1]
var targetPort = +args[2]

if (args.length < 3) {
  targetPort = +targetHost
  targetHost = 'localhost'
}

var spy = tcpSpy({
  port: spyPort,
  forwardHost: targetHost,
  forwardPort: targetPort
})

var id = 0

spy.on('connection', function (client, server) {
  id++

  console.log(id + ' ' + chalk.green('+++'))

  var clientParser = mqttPacket.parser()
  client.on('data', clientParser.parse.bind(clientParser))
  clientParser.on('packet', inspect.bind(null, id + ' ' + chalk.magenta('-->')))
  client.on('end', end)

  var serverParser = mqttPacket.parser()
  server.on('data', serverParser.parse.bind(serverParser))
  serverParser.on('packet', inspect.bind(null, id + ' ' + chalk.cyan('<--')))

  function inspect(prefix, data) {
    console.log(prefix + ' ' + util.inspect(data, { colors: true }))
  }

  function end() {
    console.log(id + ' ' + chalk.red('---'))
  }
})
