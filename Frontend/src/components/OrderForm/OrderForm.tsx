'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { CustomerInfo } from './CustomerInfo'
import { OrderItemList } from './OrderItemList'
import { PlusCircle, Save } from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone: string
}

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

export default function OrderForm() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [orderType, setOrderType] = useState<'DineIn' | 'Takeaway'>('DineIn')
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    fetchCustomers()
    fetchMenuItems()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/customers')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
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

  const handleAddItem = () => {
    setOrderItems([...orderItems, { menuItemId: '', menuItemName: '', size: '', price: 0, quantity: 1, total: 0 }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      customerId: selectedCustomer || undefined,
      customerName: selectedCustomer ? undefined : customerName,
      customerPhone: selectedCustomer ? undefined : customerPhone,
      type: orderType,
      orderItems: orderItems.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      status: 'Ongoing'
    }

    try {
      await axios.post('http://localhost:3000/api/orders', orderData)
      alert('Order created successfully')
      // Reset form
      setSelectedCustomer('')
      setCustomerName('')
      setCustomerPhone('')
      setOrderType('DineIn')
      setOrderItems([])
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">New Order</h2>
      
      <CustomerInfo
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        orderType={orderType}
        setOrderType={setOrderType}
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Order Items</h3>
        <OrderItemList
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          menuItems={menuItems}
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-4 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Order
        </button>
      </div>
    </form>
  )
}