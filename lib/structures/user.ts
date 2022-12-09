import Client from "../client/client";

interface User {
    id: string;
    name: string;
    username: string;
    profile_thumb: string;
}

class User implements User {
    constructor(user: User, client: Client) {
        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.profile_thumb = user.profile_thumb;
    }   
}

export default User;