import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { useEffect, useState } from 'react'



fcl.config()
  .put("discovery.wallet", "http://localhost:8701/fcl/authn")
  .put("accessNode.api", "http://localhost:8888")

export default function MultiAuth() {

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
    
    const textFn = () => {
      const text = "I am authorized now..."
      return text
    }
    
    const dingoFn = async (txAccount) => { 
      const signer = async() => { 
        const key = '73488483dab611f5acd7b87923a2f3d0426a283c455c910cb6907686064249fc'
        const msg = 'Sign the test txn'        
        const res = await fetch(`/api/sign?p_key=${key}&s_msg=${msg}`)          
        const data = await res.text()        
        return { 
          addr: "0x179b6b1cb6755e31", 
          keyId: 0, 
          signature: data                  
        }       
      }      
      return { 
        ...txAccount, 
        addr: "0x179b6b1cb6755e31", 
        keyId: 0, 
        signingFunction: signer
      } 
    }



    const payerFn = async (txAccount) => { 
      const signer = async() => { 
        const key = '73488483dab611f5acd7b87923a2f3d0426a283c455c910cb6907686064249ee'
        const msg = 'Sign the test txn'
        const res = await fetch(`/api/sign?p_key=${key}&s_msg=${msg}`)          
        const data = await res.text()        
        return { 
          addr: "0xf3fcd2c1a78f5eee", 
          keyId: 0, 
          signature: data
        }        
      }      
      return { 
        ...txAccount, 
        addr: "0xf3fcd2c1a78f5eee", 
        keyId: 0, 
        signingFunction: signer
      } 
    }

    const auth3Fn = async (txAccount) => { 
      const signer = async() => { 
        const key = '73488483dab611f5acd7b87923a2f3d0426a283c455c910cb690768606424915'
        const msg = 'Sign the test txn'
        const res = await fetch(`/api/sign?p_key=${key}&s_msg=${msg}`)          
        const data = await res.text()        
        return { 
          addr: "0xe03daebed8ca0615", 
          keyId: 0, 
          signature: data                  
        }         
      }      
      return { 
        ...txAccount, 
        addr: "0xe03daebed8ca0615", 
        keyId: 0, 
        signingFunction: signer
      } 
    }

    const txnId = await fcl.mutate({
      cadence: `
        import flowtify from 0xf8d6e0586b0a20c7
        
        transaction (newMsg: String) {          
          prepare(acct1: AuthAccount, acct2: AuthAccount, acct3: AuthAccount) {
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
        arg("Authorized...", t.String)
      ],
      proposer: dingoFn,
      payer: dingoFn,      
      authorizations: [dingoFn, payerFn, auth3Fn],
      //authorization: [dingoFn],
      limit: 50
    })
    console.log('TxnID ',txnId)
    const txn = await fcl.tx(txnId).onceSealed()
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