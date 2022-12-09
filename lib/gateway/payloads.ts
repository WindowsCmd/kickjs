import { CLIENT_OP_CODES } from "./constants";

export const PING = ({
    event: CLIENT_OP_CODES.PING,
    data: {}
});


export const SUBSCRIBE_TO_CHATROOM = (id: string) => ({
    event: CLIENT_OP_CODES.SUBSCRIBE,
    data: {
        auth: "",
        channel: `chatrooms.${id}`
    }
});