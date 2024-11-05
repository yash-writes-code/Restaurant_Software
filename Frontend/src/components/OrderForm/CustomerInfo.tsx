

interface Customer {
  id: string
  name: string
  phone: string
}

interface CustomerInfoProps {
  customers: Customer[]
  selectedCustomer: string
  setSelectedCustomer: (id: string) => void
  customerName: string
  setCustomerName: (name: string) => void
  customerPhone: string
  setCustomerPhone: (phone: string) => void
  orderType: 'DineIn' | 'Takeaway'
  setOrderType: (type: 'DineIn' | 'Takeaway') => void
}

export function CustomerInfo({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  orderType,
  setOrderType
}: CustomerInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <div className="mt-1 relative">
          <select
            id="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a customer</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name} ({cust.phone})
              </option>
            ))}
            <option value="new">New Customer</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          </div>
        </div>
      </div>

      {selectedCustomer === 'new' && (
        <>
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
          Order Type
        </label>
        <select
          id="orderType"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as 'DineIn' | 'Takeaway')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="DineIn">Dine In</option>
          <option value="Takeaway">Takeaway</option>
        </select>
      </div>
    </div>
  )
}