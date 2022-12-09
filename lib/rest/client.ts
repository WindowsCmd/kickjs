import axios, { AxiosInstance } from 'axios';
import { BASE_URL, REFERER } from './constants';


class RESTClient {
    fetcher: AxiosInstance;
    token: string;

    constructor(xsrfToken: string, cookie: string) {
        this.fetcher = axios.create({
            baseURL: BASE_URL,
            headers: {
                "Referer": REFERER,
                "Accept-Encoding": "application/json",
                "Content-Type": "application/json, text/plain, */*",
                "Cookie": cookie,
                "X-XSRF-TOKEN": xsrfToken
            },
            decompress: false
        });

        this.token = "";
    }

    setToken(token: string) {
        this.token = token;
        this.fetcher.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export default RESTClient;