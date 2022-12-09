import { EventEmitter } from "events";
import { ChannelManager } from "../managers/channels";
import { Logger } from 'tslog';
import Gateway from "../gateway";
import RESTClient from "../rest/client";
import ChatroomManager from "../managers/chatroom";
import Message from "../structures/message";

declare interface Client {
    on(event: 'messageCreate', listener: (name: Message) => void): this;
    on(event: "ready", listener: (client: this) => void): this;
    on(event: string, listener: Function): this;
}

interface ClientOptions {
    wsURI?: string;
    xsrfToken: string;
    cookie: string;
}

class Client extends EventEmitter {
    ws: Gateway;
    token: string;
    rest: RESTClient;
    startTime: number;
    channels: ChannelManager;
    chatrooms: ChatroomManager;
    logger: Logger<any>;

    constructor(options: ClientOptions) {
        super();

        this.logger = new Logger({})
        
        this.token = "";
        this.ws = new Gateway("");
        this.rest = new RESTClient(options.xsrfToken, options.cookie);
        this.startTime = Date.now();

        //Managers
        this.channels = new ChannelManager(this);
        this.chatrooms = new ChatroomManager(this);

        //Events
        this.ws.on("ready", () => this.emit("ready", this));
        
        //TODO: clean up
        this.ws.on("messageCreate", (d: any) => {
            //Also we may want to cache the user as well 
            console.log(d);
            this.emit("messageCreate", this.chatrooms.get(d.message.chatroom_id).messages.add(d.message));
        });
    }
    login(token: string) {
        this.token = token;
        this.rest.setToken(this.token);
        this.ws.connect(this.token);
    }
}

export default Client;
