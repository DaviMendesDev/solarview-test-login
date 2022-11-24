import {Cookies} from "react-cookie";

export default function cookie(name = null, set = null) {
    const cookieConnector = new Cookies()

    if (name && set)
        return cookieConnector.set(name, set)

    if (name)
        return cookieConnector.get(name)

    return cookieConnector
}