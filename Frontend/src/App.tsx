import './App.css'

import OrderForm from './components/OrderForm/OrderForm'
import MenuItemsList from './components/Menu/MenuItemsList'
import { Routes,Route } from 'react-router-dom'

function App() {
  
  return (
    <Routes>
      <Route path='/' element = {<MenuItemsList/>}></Route>
      <Route path='/order' element = {<OrderForm/>}></Route>
    </Routes>
  )
}

export default App
