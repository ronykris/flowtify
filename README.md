# Flowtify

Flowtify solves the problem of the lack of a notification mechanism within the Flow ecosystem. Currently, users, developers, and smart contracts on Flow have limited visibility and rely solely on events and updates. This hinders efficient collaboration and decision-making. 

It addresses this problem by providing instant email notifications, ensuring prompt and reliable information delivery to participants. By tightly integrating with the Flocial protocol, which is a social networking protocol for flow, Flowtify retrieves relevant profile data and delivers notifications in real time.

Other dAppps can leverage Flowtify's publicly available API to seamlessly integrate notifications into their dApps or manually trigger notifications from Flowtify's dApp as needed. This improves the user experience, enhances communication, and enables timely responses to critical activities within the Flow ecosystem.

We also improve discoverability by providing the ability to search for users by username, wallet address, or even full name, Flowtify makes it easier to find and connect with specific users on the Flow blockchain. This feature streamlines user engagement and improves communication within the Flow ecosystem.

We had a talk with flow developers regarding some problems they face & dev tools they need. One of these problems was a major inspiration behind building Flowtify. Currently, there's no notification mechanism for approval requests of multi-sig/auth transactions. This causes delays in approval and hence is very inefficient. Flowtify offers a solution for this, In the future, the developers/approvers would be specifically tagged on Flocial and hence sending notification to approvers would be very easy. This is just one ideal use-case for flowtify! There're many more...

### Note

To use Flowtify sign up here [Flocial](https://flocial.vercel.app/)

To use the public API for Flowtify follow instructions below

```
const endpoint = {
    prod: 'https://flowtifyapi-6k6gsdlfoa-em.a.run.app',
    test: 'http://localhost:3001'
}

const main = async (data) => {
    /*const result = await axios.post(`${endpoint.prod}/notify`,
    data,
    )
    console.log(result)*/

    const response = await fetch('http://localhost:3001/notify', {    
      method: 'POST',
      mode: 'cors',      
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    const newdata = await response.json()
    console.log(newdata)
}
const data = { 
    addresses: ["0xb5bd1bfcd1f36235", "0x0fb74b342aea7798"], //Note: these addresses must be registered in Flocial.
    message: "You have a notification from the server"
}
main(data)
```