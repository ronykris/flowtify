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
    
    const authorizationFunction = (address, keyId) =>
        async (account) => {
      return {
        ...account,
        tempId: `${address}-${keyId}`,
        addr: address,
        keyId: Number(keyId),
        signingFunction: async signable => {
          var signed = await fetch(`/api/sign?s_msg=${signable.message}`)

          console.log(signed);
          return {
            addr: address,
            keyId: Number(keyId),
            signature: await signed.text(),
          }
        }
      }
    }

    const txnId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xee82856bf20e2aa6
        import FlowToken from 0x0ae53cb6e3f42a79

        transaction {

          let senderVault: &FungibleToken.Vault
          let receiverVault: &FungibleToken.Vault

          prepare(sender: AuthAccount, user: AuthAccount) {

            // Get a reference to the signer's stored vault
            self.senderVault = sender.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
            \t\t\t?? panic("Could not borrow reference to the owner's Vault!")

            self.receiverVault = user.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
            \t\t\t?? panic("Could not borrow reference to the owner's Vault!")
          }

          execute {

            // Deposit the withdrawn tokens in the recipient's receiver
            self.receiverVault.deposit(from: <- self.senderVault.withdraw(amount: 1.0))
          }    
        }`,
      args: (arg, t) => [
        //arg("Authorized...", t.String)
      ],
      proposer: authorizationFunction("f8d6e0586b0a20c7",0),
      payer: authorizationFunction("f8d6e0586b0a20c7",0),
      authorizations: [
        authorizationFunction("f8d6e0586b0a20c7",0),
        fcl.currentUser,
      ],
      limit: 50
    })
    console.log('TxnID ',txnId)
    const txn = await fcl.tx(txnId).onceSealed()
    console.log(txn)    
  }

  const getText = async () => {
    const res = await fcl.send([
      fcl.script`
        //import flowtify from 0xf8d6e0586b0a20c7

        pub fun main(): String {
        return "42"
         // return flowtify.msg
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