import {MqttClient} from "./mqttClient";

console.log("Coffee state firebase db forwarder is starting")

let mqttClient = new MqttClient('ws://mqtt.42volt.de:9001/');

process.on('SIGTERM' || 'SIGINT', function () {
  console.log("Coffee state firebase db forwarder is shuting down")
  mqttClient.end();

  // shutdown anyway after some time
  setTimeout(function(){
      process.exit(0);
  }, 8000);
});
