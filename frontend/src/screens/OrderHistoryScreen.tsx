import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OrderHistory'>;
};

// Mock data cho lịch sử đơn hàng
const orderHistoryData = [
  {
    id: '1',
    date: '15/03/2024',
    total: '498.000đ',
    status: 'Đã giao',
    items: [
      { name: 'Áo thun nam', quantity: 2, price: '149.000đ' },
      { name: 'Quần jean', quantity: 1, price: '200.000đ' },
    ],
  },
  {
    id: '2',
    date: '10/03/2024',
    total: '697.000đ',
    status: 'Đang giao',
    items: [
      { name: 'Áo khoác', quantity: 1, price: '497.000đ' },
      { name: 'Nón', quantity: 1, price: '200.000đ' },
    ],
  },
  {
    id: '3',
    date: '05/03/2024',
    total: '398.000đ',
    status: 'Chờ xác nhận',
    items: [
      { name: 'Giày thể thao', quantity: 1, price: '398.000đ' },
    ],
  },
];

const OrderHistoryScreen = ({ navigation }: Props) => {
  const [orders, setOrders] = useState(orderHistoryData);

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Xác nhận hủy đơn',
      'Bạn có chắc chắn muốn hủy đơn hàng này?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: () => {
            // Cập nhật trạng thái đơn hàng thành "Đã hủy"
            setOrders(
              orders.map((order) =>
                order.id === orderId
                  ? { ...order, status: 'Đã hủy' }
                  : order
              )
            );
            Alert.alert('Thành công', 'Đã hủy đơn hàng');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã giao':
        return '#4CAF50';
      case 'Đang giao':
        return '#FF9800';
      case 'Chờ xác nhận':
        return '#2196F3';
      case 'Đã hủy':
        return '#f44336';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderDate}>Ngày đặt: {order.date}</Text>
              <Text
                style={[
                  styles.orderStatus,
                  { color: getStatusColor(order.status) },
                ]}
              >
                {order.status}
              </Text>
            </View>

            <View style={styles.orderItems}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalText}>Tổng tiền:</Text>
              <Text style={styles.totalAmount}>{order.total}</Text>
            </View>

            {(order.status === 'Chờ xác nhận') && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(order.id)}
              >
                <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 15,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderHistoryScreen; 