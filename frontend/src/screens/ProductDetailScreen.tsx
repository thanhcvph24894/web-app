import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types/navigation';

type Comment = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
};

type ProductWithDetails = Product & {
  sizes: string[];
  colors: string[];
  relatedProducts: Product[];
  comments: Comment[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ navigation, route }: Props) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  
  // Lấy product từ route params và thêm thông tin chi tiết
  const productWithDetails: ProductWithDetails = {
    ...route.params.product,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#808080', '#000000', '#1a1a1a'],
    rating: 5.0,
    reviews: 232,
    description: 'Mô tả sản phẩm...',
    relatedProducts: [
      {
        id: 1,
        name: 'Áo Thun Basic',
        price: '199.000đ',
        image: 'https://example.com/product1.jpg',
      },
      {
        id: 2,
        name: 'Áo Polo Nam',
        price: '299.000đ',
        image: 'https://example.com/product2.jpg',
      },
      {
        id: 3,
        name: 'Áo Sơ Mi Trắng',
        price: '399.000đ',
        image: 'https://example.com/product3.jpg',
      },
    ],
    comments: [
      {
        id: '1',
        user: 'Nguyễn Văn A',
        avatar: 'https://example.com/avatar1.jpg',
        rating: 5,
        content: 'Sản phẩm rất tốt, chất lượng cao!',
        date: '2024-03-20',
      },
      {
        id: '2',
        user: 'Trần Thị B',
        avatar: 'https://example.com/avatar2.jpg',
        rating: 4,
        content: 'Đẹp, đúng size, giao hàng nhanh',
        date: '2024-03-19',
      },
    ],
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      ...productWithDetails,
      selectedSize,
      quantity
    });
  };

  const renderRelatedProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.relatedProductItem}
      onPress={() => navigation.push('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
        <View>
          <Text style={styles.commentUser}>{item.user}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={14}
                color={index < item.rating ? "#FFD700" : "#e0e0e0"}
              />
            ))}
          </View>
        </View>
        <Text style={styles.commentDate}>{item.date}</Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productWithDetails.image }}
            style={styles.productImage}
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productWithDetails.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{productWithDetails.rating}</Text>
            <Text style={styles.reviews}>({productWithDetails.reviews} đánh giá)</Text>
          </View>

          {/* Size Selection */}
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeContainer}>
            {productWithDetails.sizes.map((size: string) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSize
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color Selection */}
          <Text style={styles.sectionTitle}>Màu</Text>
          <View style={styles.colorContainer}>
            {productWithDetails.colors.map((color: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorButton, { backgroundColor: color }]}
              />
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Icon name="remove" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Icon name="add" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Related Products */}
          <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
          <FlatList
            data={productWithDetails.relatedProducts}
            renderItem={renderRelatedProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.relatedProductsList}
          />

          {/* Comments Section */}
          <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
          <View style={styles.commentsContainer}>
            {productWithDetails.comments.map((comment) => (
              <View key={comment.id}>
                {renderComment({ item: comment })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng | {productWithDetails.price}</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 400,
  },
  imageContainer: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  reviews: {
    marginLeft: 4,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSize: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeText: {
    fontSize: 16,
    color: '#000',
  },
  selectedSizeText: {
    color: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#000',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  relatedProductsList: {
    marginBottom: 16,
  },
  relatedProductItem: {
    width: 150,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  relatedProductImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
    marginTop: 8,
  },
  relatedProductPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  commentsContainer: {
    marginTop: 8,
  },
  commentItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ProductDetailScreen; 