import axios from "axios";
import cookie from "./cookie";

export default function baseApi() {
    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            common: {
                ['Content-type']: 'application/json',
                ['Accept']: 'application/json',
            }
        }
    })

    if (cookie('access')) {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + cookie('access')
    }

    return api
}
