import {ec as EC} from "elliptic" // ec -> ex
import {SHA3} from "sha3"

const ec = new EC("p256");

const hash = (message) => {
    const sha = new SHA3(256)
    sha.update(Buffer.from(message, "hex"))
    return sha.digest()
}

const sign = (privateKey, message) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hash(message)) // hashMsgHex -> hash
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  const signature = Buffer.concat([r, s]).toString("hex")
  //console.log('Signature : ',signature)
  return signature
}

export default function handler(req, res) {  
  const msg = req.query.s_msg
  //emulator private key from flow.json
  var pkey = "73488483dab611f5acd7b87923a2f3d0426a283c455c910cb6907686064249fe"
  const signature = sign(pkey, msg)  
  //console.log(signature)
  res.status(200).send(signature)
}
