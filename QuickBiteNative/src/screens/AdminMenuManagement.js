import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  StatusBar,
  RefreshControl,
  Modal,
} from 'react-native';

const AdminMenuManagement = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [foodList, setFoodList] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with tomato sauce and mozzarella',
      price: 299,
      category: {categoryName: 'Pizza'},
      img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      status: true,
      avgRating: 4.5,
    },
    {
      id: 2,
      name: 'Chicken Burger',
      description: 'Juicy grilled chicken burger with fresh vegetables',
      price: 199,
      category: {categoryName: 'Burgers'},
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      status: true,
      avgRating: 4.2,
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan and croutons',
      price: 149,
      category: {categoryName: 'Salads'},
      img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      status: false,
      avgRating: 4.0,
    },
  ]);

  const [categories] = useState([
    'All',
    'Pizza',
    'Burgers',
    'Salads',
    'Beverages',
    'Desserts',
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleToggleStock = id => {
    setFoodList(prevList =>
      prevList.map(item =>
        item.id === id ? {...item, status: !item.status} : item,
      ),
    );
  };

  const filteredProducts = foodList.filter(product => {
    if (selectedCategory === 'All') return true;
    const categoryName = product.category?.categoryName || product.category?.name;
    return categoryName === selectedCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Menu Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your restaurant menu
          </Text>
        </View>
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}>
          <View style={styles.sideMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Admin Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Menu Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('PromoCode');
              }}>
              <Text style={styles.menuItemText}>Promocode</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ViewOrders');
              }}>
              <Text style={styles.menuItemText}>View Order</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ViewCustomers');
              }}>
              <Text style={styles.menuItemText}>View Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ViewDeliveryPartners');
              }}>
              <Text style={styles.menuItemText}>Delivery Partner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Login');
              }}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category &&
                    styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category &&
                      styles.categoryChipTextActive,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProduct')}>
              <Text style={styles.addButtonText}>+ Add Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddCategory')}>
              <Text style={styles.addButtonText}>+ Category</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.itemCount}>
            {filteredProducts.length} items found
          </Text>
        </View>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <View key={product.id} style={styles.productCard}>
              <Image
                source={{uri: product.img}}
                style={styles.productImage}
              />
              
              <View style={styles.productContent}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      product.status
                        ? styles.statusAvailable
                        : styles.statusUnavailable,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        product.status
                          ? styles.statusTextAvailable
                          : styles.statusTextUnavailable,
                      ]}>
                      {product.status ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>

                <View style={styles.productDetails}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>
                      {product.category?.categoryName || 'No Category'}
                    </Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingIcon}>⭐</Text>
                    <Text style={styles.ratingText}>
                      {product.avgRating || 0}/5
                    </Text>
                  </View>
                </View>

                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => navigation.navigate('EditProduct', {product})}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.stockButton,
                        product.status
                          ? styles.outOfStockButton
                          : styles.inStockButton,
                      ]}
                      onPress={() => handleToggleStock(product.id)}>
                      <Text style={styles.stockButtonText}>
                        {product.status ? 'Out of Stock' : 'In Stock'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#000',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productContent: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusAvailable: {
    backgroundColor: '#d4edda',
  },
  statusUnavailable: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#155724',
  },
  statusTextUnavailable: {
    color: '#721c24',
  },
  productDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  stockButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  outOfStockButton: {
    backgroundColor: '#dc3545',
  },
  inStockButton: {
    backgroundColor: '#28a745',
  },
  stockButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  menuButton: {
    marginRight: 12,
    padding: 8,
  },
  menuIcon: {
    fontSize: 28,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  sideMenu: {
    backgroundColor: '#fff',
    width: '75%',
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  closeButton: {
    fontSize: 28,
    color: '#000',
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 8,
    backgroundColor: '#dc3545',
    marginHorizontal: 16,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AdminMenuManagement;
