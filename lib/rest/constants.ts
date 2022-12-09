export const BASE_URL = `https://kick.com`;
export const REFERER = `https://kick.com`;

export const ENDPOINTS = {
    getCurrentUser: `/api/v1/user`,
    sendChatMessaage: `/api/v1/chat-messages`,
    sendChatReaction: `/api/v1/message-react`,
    getChannel: (username: string) => `/api/v1/channels/${username}`, 
    getChatroom: (username: string) => `/api/v1/${username}/chatroom`,
};