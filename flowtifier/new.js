//batchSend.js
import SibApiV3Sdk from 'sib-api-v3-sdk'
import config from 'dotenv/config'
import * as fcl from "@onflow/fcl";
import "./flow/config.js";


    const sendEmail = async(obj) => {
        console.log(obj)        
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.API_KEY
        const data = await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
                "sender":{ "email":"notifier@flocial.com", "name":"Flocial"},
                "subject": "You have a txn waiting to be approved...",
                "htmlContent":"<!DOCTYPE html><html><body><h3>Reminder</h3><p>A txn is waiting for your approval...</p></body></html>",
                "messageVersions":[{ "to": obj }]            
           })
        console.log(data)           
    }

const emails = [
    {
       "email":"andronoop09@gmail.com",
       "name":"Andro Noop"
    },
    {
       "email":"rony.kris@gmail.com",
       "name":"Rony"
    },
    {
        "email":"afroblue09@gmail.com",
        "name":"Afro"
     }              
]

const addresses = ["0xb5bd1bfcd1f36235", "0xf29693609c4d4494"]
const main = async (addresses) => {
    if (!Array.isArray(addresses) || addresses === null) {
        throw new Error("Invalid argument OR No argument was sent")
    }
    try {

        addresses.forEach(async(element) => {
            const profile = await fcl.query({            
                cadence: `
                    import Profile from 0xf41fd3cb80a5dce4
        
                    pub fun main(address: Address): Profile.ReadOnly? {
                    return Profile.read(address)
                    }
                `,
                args: (arg, t) => [arg(element, t.Address)]
            })            
            console.log('Response ', profile)
            const emails = [
                {
                    "email": profile.email,
                    "name": profile.fullname
                }
            ]
            await sendEmail(emails)    
        });

    } catch (e) { console.error(e)}
    
}
 
main(addresses)