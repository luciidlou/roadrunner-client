import { FetchOptions } from "../utilities/FetchOptions"
import { Settings } from "../utilities/Settings"

export const BidRepository = {
    async loadBids(id) {
        const res = await fetch(`${Settings.remoteUrl}/bids/${id}/loadbids`, FetchOptions())
        return await res.json()
    },
    async delete(id) {
        await fetch(`${Settings.remoteUrl}/bids/${id}`, FetchOptions("DELETE"))
    },
}