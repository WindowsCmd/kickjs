export const SERVER_OP_CODES = { 
    
    //Pusher events
    CONNECTED: "pusher:connection_established",
    PONG: "pusher:pong",

    //Custom events
    MESSAGE_SENT: "App\\Events\\ChatMessageSentEvent",
    MESSAGE_REACT: "App\\Events\\ChatMessageReact"

};

export const CLIENT_OP_CODES = {

    //Pusher events
    PING: "pusher:ping",
    SUBSCRIBE: "pusher:subscribe",

    //Custom events
};