import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const UserRepository = {
    async retrieve(id) {
        const res = await fetch(`${Settings.remoteUrl}/users/${id}`, FetchOptions())
        return await res.json()
    }
}