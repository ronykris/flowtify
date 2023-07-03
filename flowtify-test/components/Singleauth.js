import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { useEffect, useState } from 'react'

fcl.config()
  .put("discovery.wallet", "http://localhost:8701/fcl/authn")
  .put("accessNode.api", "http://localhost:8888")

export default function SingleAuth() {

  const [user, setUser] = useState({addr: ''})
  const [msg, setMsg] = useState()
  const [newMsg, setNewMsg] = useState()

  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
  }, [])

  const login = async () => {
    await fcl.authenticate()
  }

  const logout = () => {
    fcl.unauthenticate()
  }

  const  updateMsg = async () => {
    console.log("In updateMsg")
    const textFn = () => {
      const text = "I am authorized now..."
      return text
    }
    
    const dingoFn = async (txAccount) => { 
      return { 
        ...txAccount, 
        addr: "0x179b6b1cb6755e31", 
        keyId: 0, 
        signingFunction: async() => { 
          return { 
            addr: "0x179b6b1cb6755e31", 
            keyId: 0, 
            signature: "0x00d52e4100773bcf4cdacb379661fb782f2cb222dc6c95d11ca803211e990510d43feeca0eacc42c942ebd7f1012f1587512c202aa2c821ce5cda59534ef63fc"
          } 
        } 
      } 
    }



    const payerFn = async (txAccount) => { 
      return { 
        ...txAccount, 
        addr: "0xf3fcd2c1a78f5eee", 
        keyId: 0, 
        signingFunction: async() => { 
          return { 
            addr: "0xf3fcd2c1a78f5eee", 
            keyId: 0, 
            signature: "0xcbe739ebfeb76fa75169af47a5fe39d5bc2fef060f283b18db532449079598a45f040d498e91d154ddc8cc2a4ada1dc917ceac7b1629ccfe199357ab1b317d18"
          } 
        } 
      } 
    }

    const auth3Fn = async (txAccount) => { 
      return { 
        ...txAccount, 
        addr: "0xe03daebed8ca0615", 
        keyId: 0, 
        signingFunction: async() => { 
          return { 
            addr: "0xe03daebed8ca0615", 
            keyId: 0, 
            signature: "0x5187bf0be267cf04329bee8b061c1cd1b506b48e77d70aeea803746908b5b99448b66144f7fec1180333baccb9bf77c90252fbfbaea6a248f4ad9831e8f1caeb" 
          } 
        } 
      } 
    }
    const txnId = await fcl.mutate({
      cadence: `
        import flowtify from 0xf8d6e0586b0a20c7
        
        transaction (newMsg: String) {          
          prepare(acct1: AuthAccount) {
            log("Authorizer...")
            
          }
          execute {
            log("Authorizer example...")
            flowtify.updateMsg(newMsg: newMsg)
            log(newMsg)
          }
        }
      `,
      args: (arg, t) => [
        arg("I am authorized now...", t.String)
      ],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,      
      //authorizations: [dingoFn, payerFn, auth3Fn],
      authorization: [fcl.currentUser],
      limit: 50
    })
    console.log('TxnID ',txnId)
    
    const txn = await fcl.tx(txnId).onceSealed()
    setNewMsg(newMsg)
    getTxn(txnId)
    console.log(txn)
    
  }

  const getText = async () => {
    const res = await fcl.send([
      fcl.script`
        import flowtify from 0xf8d6e0586b0a20c7

        pub fun main(): String {
          return flowtify.msg
        }
      `
    ]).then(fcl.decode)
    setMsg(res)
  }

  const getTxn = async(txnid) => {
    //const txn = fcl.getTransaction(txnid)
    const txn = fcl.tx(txnid)
    console.log(txn)
  }

  return (
    <div>      
      <div> 
        {user.addr ? user.addr : ''}
      </div>
      <button onClick={login}>Log In</button>
      <button onClick={logout}>Log Out</button>
      <div>
        <button onClick={getText}>Get text!</button>
      </div>
      <div>
        <h3>{msg}</h3>        
      </div>
      <div>
        <button onClick={updateMsg}>Update msg...</button>
        <div>
        <h3>{newMsg}</h3>        
        </div>
      </div>
      
      
    </div>
    
  )
}