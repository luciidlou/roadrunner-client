import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const LoadRepository = {
    async list() {
        const res = await fetch(`${Settings.remoteUrl}/loads`, FetchOptions())
        return await res.json()
    },
    async retrieve(id) {
        const res = await fetch(`${Settings.remoteUrl}/loads/${id}`, FetchOptions())
        return await res.json()
    },
    async booked() {
        const res = await fetch(`${Settings.remoteUrl}/loads/booked`, FetchOptions())
        return await res.json()
    },
    async create(obj) {
        const res = await fetch(`${Settings.remoteUrl}/loads`, FetchOptions("POST", obj))
        return await res.json()
    },
    async update(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/loads/${id}`, FetchOptions("PUT", obj))
        return res
    },
    async delete(id) {
        const res = await fetch(`${Settings.remoteUrl}/loads/${id}`, FetchOptions("DELETE"))
        return res
    },
    async placeBid(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/loads/${id}/placebid`, FetchOptions("POST", obj))
        return await res.json()
    },
    async changestatus(id, obj) {
        const res = await fetch(`${Settings.remoteUrl}/loads/${id}/changestatus`, FetchOptions("PUT", obj))
        return res
    }
}