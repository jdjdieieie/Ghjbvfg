import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from './src/screens/LandingPage';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import UserScreen from './src/screens/UserScreen';
import CartScreen from './src/screens/CartScreen';
import PlaceOrderScreen from './src/screens/PlaceOrderScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import DeliveryPartnerScreen from './src/screens/DeliveryPartnerScreen';
import AdminMenuManagement from './src/screens/AdminMenuManagement';
import PromoCode from './src/screens/PromoCode';
import ViewOrders from './src/screens/ViewOrders';
import ViewCustomers from './src/screens/ViewCustomers';
import ViewDeliveryPartners from './src/screens/ViewDeliveryPartners';
import AddProduct from './src/screens/AddProduct';
import AddCategory from './src/screens/AddCategory';
import EditProduct from './src/screens/EditProduct';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="DeliveryPartner" component={DeliveryPartnerScreen} />
        <Stack.Screen name="AdminMenu" component={AdminMenuManagement} />
        <Stack.Screen name="PromoCode" component={PromoCode} />
        <Stack.Screen name="ViewOrders" component={ViewOrders} />
        <Stack.Screen name="ViewCustomers" component={ViewCustomers} />
        <Stack.Screen name="ViewDeliveryPartners" component={ViewDeliveryPartners} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="AddCategory" component={AddCategory} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
