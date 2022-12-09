import { WebSocket } from "ws";
import { SERVER_OP_CODES } from "./constants";
import { PING } from "./payloads";
import { EventEmitter } from 'events';
import { Logger } from 'tslog';

interface Payload {
    event: string;
    data: any;
}

interface ConnectionOptions {
    version: string;
    protocol: string;
    flash: boolean;
}

interface PusherEvent {
    event: string;
    data: any; //Data is a string when we parse it, but when we look into that it should be a json object.
}

enum ConnectionState {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
}

class Gateway extends EventEmitter {
    connectionState: ConnectionState = ConnectionState.DISCONNECTED;
    ws?: WebSocket;
    connectionOptions: ConnectionOptions;
    ping: number;

    private heartbeatTimeout: number;
    private heartbeatSent: number;
    private heartbeatInterval?: NodeJS.Timer;
    private token: string;
    private wsURI: string;
    private logger: Logger<any>;

    constructor(
        token: string,
        wsURI: string = "wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c"
    ) {
        super();
        this.token = token;
        this.wsURI = wsURI;

        this.logger = new Logger({ type: "pretty",  prefix: ["[WS MANAGER]"] });

        this.ping = 0;
        this.heartbeatSent = Date.now();

        this.connectionOptions = {
            version: "7.4.0",
            protocol: "7",
            flash: false,
        };

        this.heartbeatTimeout = 0;
    }

    send(payload: Payload) {
        if(!this.ws?.OPEN)
            throw new Error("Websocket is not open!");

        this.ws.send(JSON.stringify(payload));
    }

    private startHeartbeating() {

        if(this.heartbeatInterval)
            clearInterval(this.heartbeatInterval); 

        this.heartbeatInterval = setInterval(() => {
            if(this.connectionState == ConnectionState.DISCONNECTED) {
                clearInterval(this.heartbeatInterval);
            }
            
            this.send(PING);
            this.heartbeatSent = Date.now();

            this.logger.debug(`Sending heartbeat`);
        }, this.heartbeatTimeout);
    }

    private onOpen() {
        console.debug("We have connected!");
    }

    private onMessage(msg: string) {
        const payload = JSON.parse(msg) as PusherEvent;

        if(payload.data) {
            try {
                const parsedData = JSON.parse(payload.data);

                payload.data = parsedData;
            } catch (e) {
                //Continue because we have no data for the event..
            }
        }
        
        this.logger.info(`Receiving event: ${payload.event}`);

        switch (payload.event) {
            case SERVER_OP_CODES.CONNECTED:
                this.heartbeatTimeout = (payload.data.activity_timeout * 1000);
                this.startHeartbeating();
                this.emit("ready", this);
                break;
            case SERVER_OP_CODES.PONG:
                this.ping =  Date.now() - this.heartbeatSent;
                this.logger.debug(`Heartbeat received | PING: ${this.ping}`);
                this.emit("pong", this);
                break;
            case SERVER_OP_CODES.MESSAGE_SENT:
                this.emit("messageCreate", payload.data);
            default:
                this.logger.info(`event ${payload.event} has no handler!`);
        }
    }

    private onClose() {
        console.debug("We have closed :(");
    }


    connect(token: string) {
        this.logger.debug("Connecting to: " + this.wsURI);
        this.token = token;
        this.connectionState = ConnectionState.CONNECTING;

        this.ws = new WebSocket(`${this.wsURI}?${new URLSearchParams(this.connectionOptions as any).toString()}`);

        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this));
        this.ws.on("close", this.onClose.bind(this));
    }
}

export default Gateway;
