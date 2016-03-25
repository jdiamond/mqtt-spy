#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var util = require('util')
var minimist = require('minimist')
var chalk = require('chalk')
var tcpSpy = require('./tcp-spy')
var mqttPacket = require('mqtt-packet')

var args = minimist(process.argv.slice(2), {
  boolean: [ 'forward-tls', 'forward-insecure' ]
})

if (args._.length < 2) {
  console.error('usage: %s [options] <spy-port> [target-host] <target-port>', path.basename(process.argv[1]))
  console.error('')
  console.error('options:')
  console.error('  --cert <path/to/crt>')
  console.error('  --key <path/to/key>')
  console.error('  --forward-tls')
  console.error('  --forward-ca <path/to/crt>')
  console.error('  --forward-insecure')
  process.exit(1)
}

var spyPort = +args._[0]
var targetHost = args._[1]
var targetPort = +args._[2]

if (args._.length < 3) {
  targetPort = +targetHost
  targetHost = 'localhost'
}

var spy = tcpSpy({
  port: spyPort,
  cert: args.cert && fs.readFileSync(args.cert),
  key: args.key && fs.readFileSync(args.key),
  forwardHost: targetHost,
  forwardPort: targetPort,
  forwardTLS: !!(args['forward-ca'] || args['forward-tls']),
  forwardCA: args['forward-ca'] && fs.readFileSync(args['forward-ca']),
  forwardInsecure: args['forward-insecure']
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

console.log('listening on port %d, forwarding to %s:%d', spyPort, targetHost, targetPort)
