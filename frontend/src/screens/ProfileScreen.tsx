// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList } from '../types/navigation';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, 'ProfileTab'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

// Mock data cho thông tin người dùng
const userInfo = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0123456789',
  avatar: 'https://via.placeholder.com/100',
};

// Mock data cho đơn hàng gần đây
const recentOrders = [
  {
    id: '1',
    date: '15/03/2024',
    total: '498.000đ',
    status: 'Đã giao',
  },
  {
    id: '2',
    date: '10/03/2024',
    total: '697.000đ',
    status: 'Đang giao',
  },
];

const ProfileScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
            <Text style={styles.userPhone}>{userInfo.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="pencil" size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="person-outline" size={24} color="#000" />
            <Text style={styles.menuText}>Thông tin cá nhân</Text>
            <Icon name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="location-outline" size={24} color="#000" />
            <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
            <Icon name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="card-outline" size={24} color="#000" />
            <Text style={styles.menuText}>Phương thức thanh toán</Text>
            <Icon name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: Navigate to order history screen
                console.log('Navigate to order history');
              }}
            >
              <Text style={styles.viewAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderItem}>
              <View>
                <Text style={styles.orderDate}>{order.date}</Text>
                <Text style={styles.orderTotal}>{order.total}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text
                  style={[
                    styles.orderStatus,
                    {
                      color: order.status === 'Đã giao' ? '#4CAF50' : '#FF9800',
                    },
                  ]}
                >
                  {order.status}
                </Text>
                <Icon name="chevron-forward" size={24} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            // TODO: Handle logout
            navigation.navigate('Login');
          }}
        >
          <Icon name="log-out-outline" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  section: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  viewAll: {
    color: '#007BFF',
    fontSize: 14,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
});

export default ProfileScreen;