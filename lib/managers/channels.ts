import Client from "../client/client";
import Collection from "./collection";
import { ENDPOINTS } from "../rest/constants";
import Channel from "../structures/channel";
import ChatroomManager from "./chatroom";

export class ChannelManager extends Collection {
    client: Client;

    constructor(client: Client) {
        super(Channel, client);
        this.client = client;
    }

    async fetch(username: string) : Promise<Channel> {
        const data = await this.client.rest.fetcher
            .get(ENDPOINTS.getChannel(username))
            .then((res) => res.data).catch(err => {
                console.log(err.response)
                return null;
            });

        if(!data)
            throw new Error("failed to fetch");

        return this.add(data, true);
    }
}
