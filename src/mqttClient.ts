import {IClientOptions, Client, connect, IConnackPacket}  from 'mqtt'
import * as events from 'events'
import {DatabaseConnector} from "./notifications"

const typeDictionary = {
    "WorkingState" : "coffee_brewing",
    "ReadyState" : "coffee_ready"
}

export class MqttClient  extends events.EventEmitter  {

    mqttClient: Client;
    databaseConnector : DatabaseConnector;

    constructor(host: string) {
        super();
        this.databaseConnector = new DatabaseConnector();

        const opts: IClientOptions = {}

        this.mqttClient = connect(host, opts);
        this.mqttClient.on('connect', this.onConnect.bind(this));
        this.mqttClient.on('message', this.onMessage.bind(this));
    }

    onConnect() {
        this.mqttClient.subscribe('coffee/0/state');
        this.mqttClient.subscribe('coffee/0/weight');
        console.log("Connected to Mqtt Server.")
    }

    // private functions

    onMessage(topic: any, message: any): any {
        const messageObj = JSON.parse(message);
        if(topic.endsWith("state") ) {
            try {
                console.log("Refresh state in DB: " + messageObj); 
                this.databaseConnector.sendToAll(typeDictionary[messageObj['state']], messageObj['timestamp']);
            } catch {

            }
        }
        else if(topic.endsWith("weight") && messageObj['state'].endsWith("CoffeePodPlaced") ) {
            try {
                console.log("Refresh level in DB"); 
                this.databaseConnector.sendLevelToAll(
                    typeDictionary[messageObj['state']], 
                    messageObj['timestamp'], 
                    messageObj['weight']);
            } catch {

            }
        }
    }

    end() {
        this.mqttClient.end();
    }
}

export default MqttClient;