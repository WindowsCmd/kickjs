import Client from "../client/client";
import { randomBytes } from 'crypto';
import { ENDPOINTS } from "../rest/constants";

interface Channel {
    client: Client;
    id: number;
    user_id: number;
    slug: string;
    name: string;
    playback_url?: string;
    banner_image?: string;
    chatroom: {
        id: number;
    };
    followersCount: string;
    user?: any;
}

class Channel implements Channel { 

    constructor(channel: Channel, client: Client)  {
        this.client = client;

        console.log(channel);

        this.id = channel.id;
        this.user_id = channel.user_id;
        this.name = channel.name;
        this.slug = channel.slug;
        this.playback_url = channel.playback_url;
        this.banner_image = channel.banner_image;
        this.followersCount = channel.followersCount;
        this.chatroom = channel.chatroom;
    }

    sendMessage(message: string) {
        this.client.rest.fetcher.post(ENDPOINTS.sendChatMessaage, {
            chatroom_id: this.chatroom.id,
            //cuz they want in seconds
            created_at:  Math.round(Date.now() / 1000),
            message: message,
            id: randomBytes(32).toString("hex")
        }).then(res => {
            console.log(res.data);
        });
    }
}

export default Channel;