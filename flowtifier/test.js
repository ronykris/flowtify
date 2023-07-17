import axios from 'axios'

const endpoint = {
    prod: 'https://flowtifyapi-6k6gsdlfoa-em.a.run.app',
    test: 'http://localhost:3001'
}

const main = async (data) => {
    const result = await axios.post(`${endpoint.prod}/notify`,
    data,
    )
    console.log(result)
}
const data = { 
    addresses: ["0xb5bd1bfcd1f36235", "0x0fb74b342aea7798"],
    message: 'You have a notification from the server'
}
main(data)