import SibApiV3Sdk from 'sib-api-v3-sdk'
import config from 'dotenv/config'
import * as fcl from "@onflow/fcl";
import "./flow/config.js";


const sendEmail = async(obj, msg) => {
    console.log(obj)        
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.API_KEY
    try {
        const data = await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
            "sender":{ "email":"notifier@flocial.com", "name":"Flocial"},
            "subject": "You have a Notification from FLOWTIFY",
            "htmlContent":`<!DOCTYPE html><html><body><h3>Notification</h3><p>${msg}</p></body></html>`,
            "messageVersions":[{ "to": obj }]            
        })
        //console.log(data) 
        return data
    } catch (e) {
        console.error(e)
        return 'error'
    }              
}

const notify = async (addresses, message) => {
    if (!Array.isArray(addresses) || addresses === null) {
        throw new Error("Invalid argument OR No argument was sent")
    }
    if (!message) {
        throw new Error("Please add a message")
    }
    try {
        let emails = []
        const addressCount = addresses.length
        for (const address of addresses) {        
            const profile = await fcl.query({            
                cadence: `
                    import Profile from 0xf41fd3cb80a5dce4
        
                    pub fun main(address: Address): Profile.ReadOnly? {
                    return Profile.read(address)
                    }
                `,
                args: (arg, t) => [arg(address, t.Address)]
            })            
            console.log('Response ', profile)
            const contactInfo = {
                    "email": profile.email,
                    "name": profile.fullname
                }
            emails.push(contactInfo)
        }
        console.log('Emails : ', emails)
        const res = await sendEmail(emails, message)
        console.log('Res : ',res.messageIds)
        if ( res.messageIds ) {
            return 'success'
        }        
    } catch (e) { 
        console.error(e)
        return 'error'
    }    
}
 
export default notify
//main(addresses)