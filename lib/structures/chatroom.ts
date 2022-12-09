import Client from "../client/client";
import { SUBSCRIBE_TO_CHATROOM } from "../gateway/payloads";
import ChatroomManager from "../managers/chatroom";
import MessageManager from "../managers/messages";
import { randomBytes } from 'crypto';
import { ENDPOINTS } from "../rest/constants";

interface Chatroom {
    id: string;
    chat_mode: string;
    slow_mode: boolean;
    created_at: Date;
    updated_at: Date;
    client: Client;
}

interface SendOptions {
    content: string;
}

class Chatroom implements Chatroom {

    messages: MessageManager;

    constructor(chatroom: Chatroom, client: Client) {
        this.id = chatroom.id;
        this.updated_at = new Date(chatroom.updated_at);
        this.created_at = new Date(chatroom.created_at);
        this.chat_mode = chatroom.chat_mode;
        this.slow_mode = chatroom.slow_mode;
        this.client = client;

        this.messages = new MessageManager(client);
    }

    send({ content }: SendOptions) {
        this.client.rest.fetcher.post(ENDPOINTS.sendChatMessaage, {
            chatroom_id: this.id,
            created_at:  Math.round(Date.now() / 1000),
            message: content,
            id: randomBytes(32).toString("hex")
        }).then(res => {
            console.log(res.data);
        });
    }

    /**
     * Listens to events/messages for the chatroom
     */
    listen() {
        this.client.ws.send(SUBSCRIBE_TO_CHATROOM(this.id));
    }
}

export default Chatroom;