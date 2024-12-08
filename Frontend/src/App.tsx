import './App.css'

import OrderForm from './components/OrderForm/OrderForm'
import MenuItemsList from './components/Menu/MenuItemsList'
import { Routes,Route } from 'react-router-dom'
import Category from './components/Category/Category'

function App() {
  
  return (
    <Routes>
      <Route path='/' element = {<MenuItemsList/>}></Route>
      <Route path='/order' element = {<OrderForm/>}></Route>
      <Route path='/category' element={<Category/>}></Route>
    </Routes>
  )
}

export default App
