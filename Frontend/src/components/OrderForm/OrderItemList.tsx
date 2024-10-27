import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface MenuItem {
  id: string
  itemName: string
  priceOptions: {
    id: string
    size: string
    price: number
  }[]
}

interface OrderItem {
  menuItemId: string
  menuItemName: string
  size: string
  price: number
  quantity: number
  total: number
}

interface OrderItemListProps {
  orderItems: OrderItem[]
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>
  menuItems: MenuItem[]
}

export function OrderItemList({ orderItems, setOrderItems, menuItems }: OrderItemListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleMenuItemChange = (index: number, menuItemId: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId)
    if (menuItem) {
      const updatedItems = [...orderItems]
      updatedItems[index] = {
        ...updatedItems[index],
        menuItemId,
        menuItemName: menuItem.itemName,
        size: menuItem.priceOptions[0]?.size || '',
        price: menuItem.priceOptions[0]?.price || 0,
        total: menuItem.priceOptions[0]?.price * updatedItems[index].quantity || 0
      }
      setOrderItems(updatedItems)
    }
  }

  const handleSizeChange = (index: number, size: string) => {
    const updatedItems = [...orderItems]
    const menuItem = menuItems.find(item => item.id === updatedItems[index].menuItemId)
    const priceOption = menuItem?.priceOptions.find(option => option.size === size)
    if (priceOption) {
      updatedItems[index] = {
        ...updatedItems[index],
        size,
        price: priceOption.price,
        total: priceOption.price * updatedItems[index].quantity
      }
      setOrderItems(updatedItems)
    }
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      total: updatedItems[index].price * quantity
    }
    setOrderItems(updatedItems)
  }

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Menu Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orderItems.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative">
                  <input
                    type="text"
                    value={item.menuItemName}
                    onChange={(e) => {
                      const updatedItems = [...orderItems]
                      updatedItems[index].menuItemName = e.target.value
                      setOrderItems(updatedItems)
                      setSearchQuery(e.target.value)
                    }}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search menu item..."
                  />
                  {searchQuery && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {menuItems
                        .filter(menuItem =>
                          menuItem.itemName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(menuItem => (
                          <li
                            key={menuItem.id}
                            onClick={() => handleMenuItemChange(index, menuItem.id)}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                          >
                            {menuItem.itemName}
                          </li>
                        ))}
                    
                    </ul>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={item.size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {menuItems
                    .find(menuItem => menuItem.id === item.menuItemId)
                    ?.priceOptions.map(option => (
                      <option key={option.id} value={option.size}>
                        {option.size}
                      </option>
                    ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">₹{item.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                  className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">₹{item.total.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}