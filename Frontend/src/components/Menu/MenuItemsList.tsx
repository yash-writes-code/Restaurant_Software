'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react'
import MenuForm from '../MenuForm/MenuForm'

type PriceOption = {
  id: string
  size: string
  price: number
}

type MenuItem = {
  id: string
  itemName: string
  available: boolean
  categoryId: string
  priceOptions: PriceOption[]
}

type Category = {
  id: string
  name: string
}

export default function MenuList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    fetchCategories()
    fetchMenuItems()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/menu-items')
      setMenuItems(response.data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const handleEdit = (item: MenuItem) => {
    const category = categories.find(c => c.id === item.categoryId)
    if (category) {
      setSelectedCategory(category)
      setSelectedItem(item)
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/menu-items/${itemId}`)
      fetchMenuItems()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleAddItem = (category: Category) => {
    setSelectedCategory(category)
    setSelectedItem(null)
  }

  const handleCloseForm = () => {
    setSelectedCategory(null)
    setSelectedItem(null)
  }

  const handleItemSaved = () => {
    fetchMenuItems()
    handleCloseForm()
  }

  const scrollToCategory = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setDropdownOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="relative mb-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Select Category
          <ChevronDown className="w-5 h-5 ml-2" />
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          ref={(el) => (categoryRefs.current[category.id] = el)}
          className="mb-8 bg-white shadow-md rounded-lg overflow-hidden"
        >
          <h2 className="text-xl font-semibold bg-gray-100 p-4 border-b">{category.name}</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-left">
                {menuItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.priceOptions.map((option) => (
                          <div key={option.id} className="text-sm text-gray-900">
                            {option.size}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.priceOptions.map((option) => (
                          <div key={option.id} className="text-sm text-gray-900">
                            ₹{option.price.toFixed(2)}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={() => handleAddItem(category)}
              className="flex items-center justify-center w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Item
            </button>
          </div>
        </div>
      ))}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              {/* <X className="w-6 h-6" /> */}
            </button>
            <MenuForm
              category={selectedCategory}
              item={selectedItem}
              onItemSaved={handleItemSaved}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}