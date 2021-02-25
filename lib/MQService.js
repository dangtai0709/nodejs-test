const amqp = require('amqplib');
const config = require("../config/config")
var ListenersMQ = require('./ListenersMQ');
let ch = null;
const CONN_URL = config.CONN_URL_AMQP;
const queueName = config.QUEUE_NAME_AMQP;
const setup = async () => {
    const conn = await amqp.connect(CONN_URL);
    ch = await conn.createChannel();
    await ch.prefetch(1);
    await ch.consume(queueName, function (payload) {
        if (payload != null) {
            console.log("Received '%s'", payload.content.toString());
            ListenersMQ.listenersManager(JSON.parse(payload.content.toString()))
            setTimeout(function () {
                ch.ack(payload);
            }, 1000);
        }
    });
}
// setup();
exports.publishToQueue = async (data) => {
    if (!ch) {
        await setup();
    }
    ch.sendToQueue(queueName, Buffer.from(data), { persistent: true });
}

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});