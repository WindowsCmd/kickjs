import Client from "../client/client";
import Message from "../structures/message";
import Collection from "./collection";

class MessageManager extends Collection {
    constructor(client: Client) {
        super(Message, client);
    }

    
} 

export default MessageManager;