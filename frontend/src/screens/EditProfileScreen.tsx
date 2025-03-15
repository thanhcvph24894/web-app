import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const EditProfileScreen = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    bankName: '',
    bankAccount: '',
    bankNumber: '',
  });

  const handleSave = () => {
    // TODO: Implement save logic
    Alert.alert('Thành công', 'Thông tin đã được cập nhật');
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Nhập họ và tên"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Nhập email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Nhập địa chỉ"
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên ngân hàng</Text>
            <TextInput
              style={styles.input}
              value={formData.bankName}
              onChangeText={(text) => setFormData({ ...formData, bankName: text })}
              placeholder="Nhập tên ngân hàng"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên chủ tài khoản</Text>
            <TextInput
              style={styles.input}
              value={formData.bankAccount}
              onChangeText={(text) => setFormData({ ...formData, bankAccount: text })}
              placeholder="Nhập tên chủ tài khoản"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số tài khoản</Text>
            <TextInput
              style={styles.input}
              value={formData.bankNumber}
              onChangeText={(text) => setFormData({ ...formData, bankNumber: text })}
              placeholder="Nhập số tài khoản"
              keyboardType="numeric"
            />
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
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
});

export default EditProfileScreen; 