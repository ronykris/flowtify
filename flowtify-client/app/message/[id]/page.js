"use client"
import { usePathname } from 'next/navigation'

export default function Message() {
  const pathname = usePathname()
  console.log(pathname)
  const path = pathname.split("/")
  const id = path[2]

  return (
    <div class="flex items-center justify-center p-12">
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="receivers">
              Receivers
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="receivers" type="text" placeholder="Receivers" value={id} />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="msg">
              Message
            </label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="msg" type="text" placeholder="Enter your message" />
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
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