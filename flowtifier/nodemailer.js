import nodemailer from 'nodemailer'

const from = 'marlen63@ethereal.email'
const msg = 'A txn is waiting for your approval...'
const to = 'rony.kris@gmail.com'

//var smtpTransport = nodemailer.createTransport(`smtps://andronoop09%40gmail.com:`+encodeURIComponent('R0nyr4y4n'))
const smtpTransport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,  
    auth: {
        user: from,
        pass: "Dtj7vxqf5vuQc3rsVd"
    }
})

const mailOptions = {
    from: from,
    to: to,
    subject: "A txn is waiting to be approved",
    text: msg
}

smtpTransport.sendMail(mailOptions, (error, response)=> {
    if (error) {
        console.log(error)
    } else {
        console.log("Email was sent successfully... " + response)
    }
})