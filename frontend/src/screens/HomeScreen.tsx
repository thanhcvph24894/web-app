import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList, Product as NavigationProduct } from '../types/navigation';
import { categoryService, productService } from '../services';
import { Category } from '../services/category-service';
import { Product, ProductListResponse } from '../services/product-service';
import { formatCurrency } from '../utils';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, 'HomeTab'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

const HomeScreen = ({ navigation }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy danh sách danh mục khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Lấy sản phẩm khi danh mục thay đổi hoặc trang thay đổi
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getCategoriesWithProducts();
      if (response.success && response.data) {
        // Thêm danh mục "Tất cả" vào đầu danh sách
        const allCategory: Category = {
          id: '',
          name: 'Tất cả',
          slug: '',
        };
        setCategories([allCategory, ...response.data]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let response;
      if (selectedCategory) {
        // Nếu đã chọn danh mục cụ thể (khác "Tất cả")
        response = await categoryService.getCategoryWithProducts(selectedCategory, page);
        if (response.success && response.data) {
          setProducts(response.data.products);
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        // Nếu chọn "Tất cả" hoặc chưa chọn danh mục nào
        response = await productService.getProducts({ page });
        if (response.success && response.data) {
          setProducts(response.data.products);
          setTotalPages(response.data.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category, index: number) => {
    if (index === 0) {
      // Nếu là "Tất cả"
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category.slug);
    }
    setPage(1); // Reset về trang 1 khi chuyển danh mục
  };

  const handleProductPress = (product: Product) => {
    // Chuyển đổi Product từ API sang Product của navigation
    const navigationProduct: NavigationProduct = {
      id: parseInt(product._id || product.id),
      name: product.name,
      price: formatCurrency(product.salePrice || product.price),
      image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150',
      description: product.description,
      rating: product.averageRating
    };
    
    navigation.navigate('ProductDetail', { product: navigationProduct });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#666" />
          <TextInput 
            placeholder="Tìm kiếm sản phẩm..."
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        {loadingCategories ? (
          <ActivityIndicator size="small" color="#000" style={styles.loader} />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={category.id || `category-${index}`} 
                style={[
                  styles.categoryItem,
                  (index === 0 && !selectedCategory) || (selectedCategory === category.slug) 
                    ? styles.categoryItemActive : null
                ]}
                onPress={() => handleCategoryPress(category, index)}
              >
                <Text style={[
                  styles.categoryText,
                  (index === 0 && !selectedCategory) || (selectedCategory === category.slug)
                    ? styles.categoryTextActive : null
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Products Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : (
          <View style={styles.productsGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <TouchableOpacity 
                  key={product._id || product.id} 
                  style={styles.productCard}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.productImageContainer}>
                    <Image 
                      source={{ uri: product.images && product.images.length > 0 
                        ? product.images[0] 
                        : 'https://via.placeholder.com/150' 
                      }}
                      style={styles.productImage}
                    />
                    <TouchableOpacity 
                      key={`favorite-${product._id || product.id}`}
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        // Handle favorite
                      }}
                    >
                      <Icon name="heart-outline" size={20} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    {formatCurrency(product.salePrice || product.price)}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noProductsText}>Không có sản phẩm nào</Text>
            )}
          </View>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity 
              style={[styles.pageButton, page === 1 && styles.disabledButton]} 
              disabled={page === 1}
              onPress={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              <Icon name="chevron-back" size={20} color={page === 1 ? "#ccc" : "#000"} />
            </TouchableOpacity>
            
            <Text style={styles.pageInfo}>Trang {page}/{totalPages}</Text>
            
            <TouchableOpacity 
              style={[styles.pageButton, page === totalPages && styles.disabledButton]} 
              disabled={page === totalPages}
              onPress={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              <Icon name="chevron-forward" size={20} color={page === totalPages ? "#ccc" : "#000"} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryItemActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productImageContainer: {
    position: 'relative',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    paddingHorizontal: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 4,
  },
  loader: {
    marginVertical: 20,
  },
  noProductsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pageButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  disabledButton: {
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  pageInfo: {
    marginHorizontal: 15,
    fontSize: 14,
  },
});

export default HomeScreen;


