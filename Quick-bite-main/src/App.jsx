import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage/LandingPage'


import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'


import User from './components/User/User'
import Admin from './components/Admin/Admin'
import DeliveryPartner from './pages/DeliveryPartner/DeliveryPartner'
import EditUserInfo from './components/User/EditUserInfo/EditUserInfo'

import About from './pages/User/About/About'
import Contact from './pages/User/Contact/Contact'
import Cart from './pages/User/Cart/Cart'

import './App.css'
import PlaceOrder from './pages/User/Placeorder/Placeorder'
import MyOrders from './pages/User/MyOrders/MyOrders'
import AddProducts from './pages/Admin/AddProducts/AddProducts'
import MenuManagement from './pages/Admin/MenuManagement/MenuManagement'
import ViewOrders from './pages/Admin/ViewOrders/ViewOrders'
import ViewCustomers from './pages/Admin/ViewCustomers/ViewCustomers'
import ViewDeliverypartners from './pages/Admin/ViewDeliverypartners/ViewDeliverypartners'
import EditProducts from './pages/Admin/EditProducts/EditProducts'
import AddCategory from './pages/Admin/AddCategory/AddCategory'
import PromoCodes from './pages/Admin/PromoCodes/PromoCodes'

const App = () => {

  return (
    <div className="app">
      <Routes>
       
        <Route path="/" element={<LandingPage />} />
        
      
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
       
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <User />
          </ProtectedRoute>
        } />
        <Route path="/user/editinfo" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <EditUserInfo />
          </ProtectedRoute>
        } />
        <Route path="/user/cart" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Cart/>
          </ProtectedRoute>
        } />
        <Route path="/user/placeorder" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PlaceOrder/>
          </ProtectedRoute>
        } />
        <Route path="/user/myorders" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MyOrders/>
          </ProtectedRoute>
        } />
        <Route path="/user/about" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <About/>
          </ProtectedRoute>
        } />
        <Route path="/user/contact" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Contact/>
          </ProtectedRoute>
        } />
        
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/MenuManagement" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MenuManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-product" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-category" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddCategory />
          </ProtectedRoute>
        } />
        <Route path="/admin/view-orders" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ViewOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/view-customers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ViewCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/view-delivery-partners" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ViewDeliverypartners />
          </ProtectedRoute>
        } />
        <Route path="/admin/promo-codes" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PromoCodes />
          </ProtectedRoute>
        } />
        <Route path="admin/edit-product" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <EditProducts />
          </ProtectedRoute>
        } />
        
        <Route path="/delivery-partner" element={
          <ProtectedRoute allowedRoles={['deliverypartner', 'delivery_partner']}>
            <DeliveryPartner />
          </ProtectedRoute>
        } />
       
      </Routes>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
