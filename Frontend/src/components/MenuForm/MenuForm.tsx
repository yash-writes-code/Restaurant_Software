'use client'

import { useState, FormEvent, useEffect } from "react"
import axios from "axios"
import { Plus, Minus, X } from 'lucide-react'

interface PriceOption {
  id?: string
  size: string
  price: number
}

interface Category {
  id: string
  name: string
}

interface MenuItem {
  id: string
  itemName: string
  available: boolean
  categoryId: string
  priceOptions: PriceOption[]
}

interface MenuFormProps {
  category: Category
  item?: MenuItem | null
  onItemSaved: () => void
  onClose: () => void
}

export default function MenuForm({ category, item, onItemSaved, onClose }: MenuFormProps) {
  const [itemName, setItemName] = useState<string>('')
  const [available, setAvailable] = useState<boolean>(true)
  const [priceOptions, setPriceOptions] = useState<Array<PriceOption>>([{ size: '', price: 0 }])
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (item) {
      setItemName(item.itemName)
      setAvailable(item.available)
      setPriceOptions(item.priceOptions)
    }
  }, [item])

  const handleSizeChange = (index: number, value: string) => {
    const updatedPriceOptions = [...priceOptions]
    updatedPriceOptions[index].size = value
    setPriceOptions(updatedPriceOptions)
  }

  const handlePriceChange = (index: number, value: number) => {
    const updatedPriceOptions = [...priceOptions]
    updatedPriceOptions[index].price = value
    setPriceOptions(updatedPriceOptions)
  }

  const handleAddPriceOption = () => {
    setPriceOptions([...priceOptions, { size: '', price: 0 }])
  }

  const handleRemovePriceOption = (index: number) => {
    const updatedPriceOptions = priceOptions.filter((_, i) => i !== index)
    setPriceOptions(updatedPriceOptions)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const menuItem = {
      itemName,
      categoryId: category.id,
      available,
      priceOptions: priceOptions.map(option => ({
        size: option.size,
        price: option.price,
      })),
    }

    try {
      if (item) {
        await axios.put(`http://localhost:3000/api/menu-items/${item.id}`, menuItem)
      } else {
        await axios.post('http://localhost:3000/api/menu-items', menuItem)
      }
      onItemSaved()
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('Item already exists')
      } else {
        console.error('Error saving menu item:', error)
        setErrorMessage('An error occurred while saving the menu item')
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {item ? 'Edit' : 'Add'} Menu Item in {category.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-700 hover:text-red-900 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            id="itemName"
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="flex items-center">
          <input
            id="available"
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Available</label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price Options</label>
          {priceOptions.map((option, index) => (
            <div key={index} className="flex space-x-2">
              <div className="flex-grow grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Size (e.g., Half, Full)"
                  value={option.size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={option.price}
                  onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemovePriceOption(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddPriceOption}
          className="mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Price Option
        </button>

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            {item ? 'Save Changes' : 'Add Menu Item'}
          </button>
        </div>
      </form>
    </div>
  )
}