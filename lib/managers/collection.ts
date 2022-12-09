import Client from "../client/client";
 
class Collection extends Map {
    base: any;
    client: Client;

    constructor(base: any, client: Client) {
        super();

        this.client = client;
        this.base = base;
    }

    /**
     * Adds a new object to the colleciton with the same type that was passed into the constructor
     */
    add(obj: any, replace = true) : any {
        if(obj.id == null) {
            throw new Error("No object ID!")!
        }

        //We get inconsistant results from the API.
        obj.id = String(obj.id);

        const existingObj = this.get(obj.id);

        if(existingObj && !replace)  {
            return existingObj;
        }

        if(!(obj instanceof this.base)) {
            obj = new this.base(obj, this.client);
        }

        this.set(String(obj.id), obj);
        return this.get(obj.id);
    }
}

export default Collection;
