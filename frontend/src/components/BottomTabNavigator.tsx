import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import {RootStackParamList, RootTabParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{tabBarLabel: 'Trang chủ'}}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{tabBarLabel: 'Giỏ hàng'}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{tabBarLabel: 'Tài khoản'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#fff'},
        }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProductsScreen}
        />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
