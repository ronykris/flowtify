"use client"
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from "react";

export default function Message() {
  const pathname = usePathname()
  console.log(pathname)
  const path = pathname.split("/")
  const id = path[2]
  const addresses = id.split("+")
  let receivers = ""
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]
    receivers += address + ", "
  }


  const [message, setMessage] = useState('') 
  
  
  const handleSubmit = async() => {
    const emailData = {
      addresses: addresses,    
      message: message          
    }
     const response = await fetch('https://flowtifyapi-6k6gsdlfoa-em.a.run.app/notify', {        
      method: 'POST',
      mode: 'cors',      
      body: JSON.stringify(emailData),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    const data = await response.json()
    console.log({ data })
  }


  return (
    <div class="flex items-center justify-center p-12 pt-36">
      <div class="w-full max-w-2xl">
        <form class="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="receivers">
              Receivers
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="receivers" type="text" placeholder="Receivers" value={receivers} />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="msg">
              Message
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline h-32" 
            id="msg" 
            type="text" 
            placeholder="Enter your message" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}        
            />
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
              onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
        <p class="text-center text-gray-500 text-xs">
          &copy;2023 Flowtify All rights reserved.
        </p>
      </div>
    </div>
  );
}