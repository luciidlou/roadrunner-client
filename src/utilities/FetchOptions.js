export const FetchOptions = (method, object) => {
    let options = {}
    if (!method && !object) {
        options = {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }
        return options
    }
    else if (method === "POST") {
        options = {
            method: "POST",
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }
        return options
    }
    else if (method === "PUT") {
        options = {
            method: "PUT",
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }
        return options
    }
    else if (method === "DELETE") {
        options = {
            method: "DELETE",
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }
        return options
    }
}