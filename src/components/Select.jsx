import { Listbox } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export default function Select ({ name, options, value, onChange }) {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setSelected(options.find(o => o.value === value))

    return () => {
      setSelected(null)
    }
  }, [value])

  const handleChange = (item) => {
    setSelected(item)
    onChange(item.value)
  }

  return (
    <Listbox value={selected} onChange={handleChange} as='div' className='w-full relative'>
      <Listbox.Button className='p-2 border border-gray-300 rounded-md text-sm text-left outline-none w-full focus:border-blue-600'>{selected ? selected.label : '--------'}</Listbox.Button>
      <Listbox.Options className='p-2 mt-2 border border-gray-300 rounded-md shadow-sm outline-none cursor-pointer absolute z-10 bg-white w-full'>
        {options.length === 0 && <p className='p-1 rounded-md text-sm font-medium text-center'>Sin datos para mostrar</p>}
        {options.map((o) => (
          <Listbox.Option
            key={o.value}
            value={o}
            className={({ active }) => clsx('p-2 rounded-md text-sm', active ? 'bg-blue-600 text-white' : 'text-gray-900')}
          >
            {o.label}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
