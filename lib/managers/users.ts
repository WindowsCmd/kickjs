import Client from "../client/client";
import Message from "../structures/message";
import Collection from "./collection";

class UserManager extends Collection {
    constructor(client: Client) {
        super(Message, client);
    }
} 

export default UserManager;