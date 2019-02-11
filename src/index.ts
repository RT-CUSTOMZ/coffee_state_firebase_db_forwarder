import {MqttClient} from "./mqttClient";

const mqttHost = process.env.MQTT_HOST || 'ws://mqtt.42volt.de:9001/'

console.log("Coffee state firebase db forwarder is starting")

let mqttClient = new MqttClient(mqttHost);

process.on('SIGTERM' || 'SIGINT', function () {
  console.log("Coffee state firebase db forwarder is shuting down")
  mqttClient.end();

  // shutdown anyway after some time
  setTimeout(function(){
      process.exit(0);
  }, 8000);
});
