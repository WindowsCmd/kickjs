import Client from "../client/client";
import { ENDPOINTS } from "../rest/constants";
import Chatroom from "../structures/chatroom";
import Collection from "./collection";
import MessageManager from "./messages";

class ChatroomManager extends Collection {
    constructor(client: Client) {
        super(Chatroom, client);
    }

    /**
     * Fetches a chatroom by channel username
     */
    async fetch(username: string) {
        const chatroom = await this.client.rest.fetcher
            .get(ENDPOINTS.getChatroom(username))
            .then((res) => res.data);
        
        if(chatroom.chatroom) {
            return this.add(chatroom.chatroom);
        } else {
            throw new Error("Failed to find chatroom!");
        }
    }
}

export default ChatroomManager;
