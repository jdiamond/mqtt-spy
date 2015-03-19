Install:

```
npm install --global mqtt-spy
```

Run:

```
mqtt-spy 1883 mqtt.example.com 1883
```

Publish:

```
mosquitto_pub -h localhost -p 1883 -t foo -m bar -q 1
```

Output:

```
1 +++
1 --> { cmd: 'connect',
  retain: false,
  qos: 0,
  dup: false,
  length: 35,
  topic: null,
  payload: null,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  keepalive: 60,
  clientId: 'mosqpub/54737-imamac2' }
1 <-- { cmd: 'connack',
  retain: false,
  qos: 0,
  dup: false,
  length: 2,
  topic: null,
  payload: null,
  sessionPresent: false,
  returnCode: 0 }
1 --> { cmd: 'publish',
  retain: false,
  qos: 1,
  dup: false,
  length: 10,
  topic: 'foo',
  payload: <Buffer 62 61 72>,
  messageId: 1 }
1 <-- { cmd: 'puback',
  retain: false,
  qos: 0,
  dup: false,
  length: 2,
  topic: null,
  payload: null,
  messageId: 1 }
1 --> { cmd: 'disconnect',
  retain: false,
  qos: 0,
  dup: false,
  length: 0,
  topic: null,
  payload: null }
1 ---
```
