import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, CartItem } from '../types/navigation';
import cartService, { Cart } from '../services/cart-service';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

type ShippingInfo = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note: string;
};

const CheckoutScreen = ({ navigation }: Props) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });
  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'banking'>('cod');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      
      // Xử lý lỗi 401 - Unauthorized
      if (response.unauthorizedError) {
        Alert.alert(
          'Thông báo',
          'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
          [
            {
              text: 'Đăng nhập',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
        setLoading(false);
        return;
      }
      
      if (response.success && response.data) {
        setCart(response.data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    
    return cart.items.reduce((total: number, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const shippingFee = 30000; // Phí ship cố định
  const total = calculateSubtotal() + shippingFee;

  const handlePlaceOrder = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống, không thể đặt hàng');
      return;
    }
    
    // Xử lý đặt hàng ở đây
    console.log('Order placed:', {
      items: cart.items,
      shipping: shippingInfo,
      payment: selectedPayment,
      total,
    });
    // Sau khi đặt hàng thành công, chuyển về trang chủ
    navigation.navigate('Main', { screen: 'HomeTab' });
  };

  const renderInput = (
    label: string,
    value: string,
    field: keyof ShippingInfo,
    placeholder: string,
    multiline: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={(text) =>
          setShippingInfo((prev) => ({ ...prev, [field]: text }))
        }
        placeholder={placeholder}
        multiline={multiline}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          {renderInput(
            'Họ và tên',
            shippingInfo.fullName,
            'fullName',
            'Nhập họ và tên người nhận'
          )}
          {renderInput(
            'Số điện thoại',
            shippingInfo.phone,
            'phone',
            'Nhập số điện thoại'
          )}
          {renderInput(
            'Địa chỉ',
            shippingInfo.address,
            'address',
            'Nhập địa chỉ giao hàng'
          )}
          {renderInput('Thành phố', shippingInfo.city, 'city', 'Nhập thành phố')}
          {renderInput(
            'Ghi chú',
            shippingInfo.note,
            'note',
            'Ghi chú cho đơn hàng',
            true
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'cod' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('cod')}
          >
            <Icon
              name={selectedPayment === 'cod' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={selectedPayment === 'cod' ? '#000' : '#666'}
            />
            <Text style={styles.paymentText}>Thanh toán khi nhận hàng (COD)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'banking' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('banking')}
          >
            <Icon
              name={
                selectedPayment === 'banking'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={24}
              color={selectedPayment === 'banking' ? '#000' : '#666'}
            />
            <Text style={styles.paymentText}>Chuyển khoản ngân hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>
              {calculateSubtotal().toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>
              {shippingFee.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {total.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            !shippingInfo.fullName && styles.disabledButton,
          ]}
          onPress={handlePlaceOrder}
          disabled={!shippingInfo.fullName}
        >
          <Text style={styles.placeOrderText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#000',
    backgroundColor: '#f8f8f8',
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  placeOrderButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen; 