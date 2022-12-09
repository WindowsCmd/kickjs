import Client from '../lib/client/client';

const client = new Client({
    xsrfToken: process.env.XSRF_TOKEN as string,
    cookie: process.env.COOKIE as string
});

client.on("ready", async () => {
   //Listen to messages from the channel
   client.chatrooms.fetch("<channel name>").then(res => res.listen())
});

client.on("messageCreate", (m) => {
    //Check if we have the correct command prefix
    if(m.message.startsWith("!test")) {
        m.react("🤨");
        m.reply({ content: "hello!" });
    }   
});

console.log(client.channels.entries());

client.login(process.env.TOKEN as string);