import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types/navigation';
import { productService } from '../services';
import { formatCurrency } from '../utils';

type Comment = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
};

type ProductWithDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  sizes: string[];
  colors: string[];
  relatedProducts: any[];
  comments: Comment[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ navigation, route }: Props) => {
  const { product } = route.params;
  const [productDetails, setProductDetails] = useState<ProductWithDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Tạm thời sử dụng slug từ tên sản phẩm
      const slug = product.name.toLowerCase().replace(/ /g, '-');
      const response = await productService.getProductDetail(slug);
      
      if (response.success && response.data) {
        // Thêm dữ liệu mẫu cho các trường không được trả về từ API
        const mockDetails: ProductWithDetails = {
          ...response.data,
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đen', 'Trắng', 'Xanh', 'Đỏ'],
          relatedProducts: [],
          comments: [
            {
              id: '1',
              user: 'Nguyễn Văn A',
              avatar: 'https://via.placeholder.com/40',
              rating: 5,
              content: 'Sản phẩm rất tốt, đúng như mô tả',
              date: '10/03/2024'
            },
            {
              id: '2',
              user: 'Trần Thị B',
              avatar: 'https://via.placeholder.com/40',
              rating: 4,
              content: 'Chất lượng ổn, giao hàng nhanh',
              date: '05/03/2024'
            }
          ]
        };
        
        setProductDetails(mockDetails);
        setSelectedImage(mockDetails.images && mockDetails.images.length > 0 ? mockDetails.images[0] : null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Thông báo', 'Vui lòng chọn kích thước');
      return;
    }

    if (!selectedColor) {
      Alert.alert('Thông báo', 'Vui lòng chọn màu sắc');
      return;
    }

    // Xử lý thêm vào giỏ hàng
    Alert.alert('Thành công', 'Đã thêm vào giỏ hàng');
  };

  const renderRelatedProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.relatedProductCard}>
      <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductName}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
        <View>
          <Text style={styles.commentUser}>{item.user}</Text>
          <Text style={styles.commentDate}>{item.date}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {Array(5).fill(0).map((_, index) => (
            <Icon 
              key={index} 
              name={index < item.rating ? "star" : "star-outline"} 
              size={16} 
              color="#FFD700" 
            />
          ))}
        </View>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!productDetails) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#666" />
        <Text style={styles.errorText}>Không thể tải thông tin sản phẩm</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ uri: selectedImage || product.image }} 
            style={styles.mainImage} 
            resizeMode="cover"
          />
        </View>

        {/* Image Thumbnails */}
        {productDetails.images && productDetails.images.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.thumbnailsContainer}
          >
            {productDetails.images.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.thumbnailButton,
                  selectedImage === image && styles.selectedThumbnail
                ]}
                onPress={() => setSelectedImage(image)}
              >
                <Image source={{ uri: image }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productDetails.name}</Text>
          
          <View style={styles.priceContainer}>
            {productDetails.salePrice ? (
              <>
                <Text style={styles.salePrice}>{formatCurrency(productDetails.salePrice)}</Text>
                <Text style={styles.originalPrice}>{formatCurrency(productDetails.price)}</Text>
              </>
            ) : (
              <Text style={styles.price}>{formatCurrency(productDetails.price)}</Text>
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            {Array(5).fill(0).map((_, index) => (
              <Icon 
                key={index} 
                name={index < Math.round(productDetails.averageRating) ? "star" : "star-outline"} 
                size={18} 
                color="#FFD700" 
              />
            ))}
            <Text style={styles.ratingText}>{productDetails.averageRating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Size Selection */}
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Kích thước</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.optionsContainer}
          >
            {productDetails.sizes.map((size, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.optionButton,
                  selectedSize === size && styles.selectedOption
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.optionText,
                  selectedSize === size && styles.selectedOptionText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Color Selection */}
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Màu sắc</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.optionsContainer}
          >
            {productDetails.colors.map((color, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.optionButton,
                  selectedColor === color && styles.selectedOption
                ]}
                onPress={() => setSelectedColor(color)}
              >
                <Text style={[
                  styles.optionText,
                  selectedColor === color && styles.selectedOptionText
                ]}>{color}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quantity Selection */}
        <View style={styles.quantityContainer}>
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Icon name="remove" size={20} color={quantity <= 1 ? "#ccc" : "#000"} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Icon name="add" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{productDetails.description}</Text>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsContainer}>
          <Text style={styles.sectionTitle}>Đánh giá ({productDetails.comments.length})</Text>
          
          {productDetails.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentUserInfo}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentDate}>{comment.date}</Text>
                </View>
                <View style={styles.commentRating}>
                  {Array(5).fill(0).map((_, index) => (
                    <Icon 
                      key={index} 
                      name={index < comment.rating ? "star" : "star-outline"} 
                      size={16} 
                      color="#FFD700" 
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.totalPriceLabel}>Tổng tiền:</Text>
          <Text style={styles.totalPrice}>
            {formatCurrency((productDetails.salePrice || productDetails.price) * quantity)}
          </Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mainImageContainer: {
    width: '100%',
    height: 400,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  thumbnailButton: {
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 2,
  },
  selectedThumbnail: {
    borderColor: '#000',
    borderWidth: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  salePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e53935',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  selectionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  selectedOption: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
  },
  quantityContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  descriptionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  commentsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  commentRating: {
    flexDirection: 'row',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  priceQuantityContainer: {
    flex: 1,
  },
  totalPriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  relatedProductCard: {
    width: 150,
    marginRight: 12,
    marginBottom: 10,
  },
  relatedProductImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  relatedProductName: {
    fontSize: 14,
    marginBottom: 4,
  },
  relatedProductPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductDetailScreen; 