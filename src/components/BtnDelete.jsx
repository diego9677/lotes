import { Popover } from '@headlessui/react'

export default function BtnDelete ({ text, onClick, msg }) {
  return (
    <Popover className='relative w-full'>
      <Popover.Button type='button' className='p-2 bg-red-600 rounded-lg text-sm font-semibold text-gray-100 w-full flex items-center justify-center'>{text}</Popover.Button>

      <Popover.Panel className='absolute w-64 mt-2 bg-gray-100 border rounded-md shadow-md outline-none z-10'>
        <div className='flex flex-col items-stretch px-4 py-2'>
          <div className='h-12'>
            <p className='text-gray-900 font-medium text-sm'>{msg}</p>
          </div>
          <div className='flex justify-end'>
            <button type='button' className='p-2 bg-red-600 rounded-lg text-sm font-semibold text-gray-100 flex items-center justify-center w-24' onClick={onClick}>Si, eliminar</button>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  )
}
