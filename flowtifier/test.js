import axios from 'axios'

const main = async (emails) => {
    const result = await axios.post('http://localhost:3001/notify',
    emails,
    )
    console.log(result)
}
const addresses = ["0xb5bd1bfcd1f36235", "0x0fb74b342aea7798"]
main(addresses)