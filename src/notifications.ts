import * as admin from 'firebase-admin';
const moment = require('moment');

var serviceAccount = require("../serviceAccountKey.json");

export class DatabaseConnector {
    app : any;
    constructor() {
        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://coffee-page-moc.firebaseio.com"
        });
    }

    sendToAll(state : string, timestamp : string) : void {

        const db = admin.database();
        var ref = db.ref("current/006CC3E5B7B43B99/coffee_machine/");
        let stateRef = ref.child("state");
        let timestampRef = ref.child("time");
        stateRef.set(state);
        timestampRef.set(timestamp);

        const logObject = {
            state: state,
            timestamp: timestamp
        }

        const loopDateTime = new moment(timestamp);
        const date = loopDateTime.format('YYYY-MM-DD');
        const time = loopDateTime.format('HH-mm-ss-SSS');
        const logRef = admin.database().ref("logs/006CC3E5B7B43B99/" + date + "/" + time);
        const logPromise = logRef.set(logObject);
    }

    sendLevelToAll(state : string, timestamp : string, level: number) : void {

        const db = admin.database();
        var ref = db.ref("current/006CC3E5B7B43B99/scale/");
        let fillLevelRef = ref.child("fill_level");
        let stateRef = ref.child("state");
        let timestampRef = ref.child("time");
        stateRef.set("coffee_fill_level");
        timestampRef.set(timestamp);
        fillLevelRef.set(level);

        const logObject = {
            state: "coffee_fill_level",
            timestamp: timestamp,
            fill_level: level
        }

        const loopDateTime = new moment(timestamp);
        const date = loopDateTime.format('YYYY-MM-DD');
        const time = loopDateTime.format('HH-mm-ss-SSS');
        const logRef = admin.database().ref("logs/006CC3E5B7B43B99/" + date + "/" + time);
        const logPromise = logRef.set(logObject);
    }
}


export default DatabaseConnector;