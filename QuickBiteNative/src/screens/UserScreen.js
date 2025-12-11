import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

const UserScreen = ({navigation}) => {
  const [category, setCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  const categories = [
    {id: 1, name: 'Pizza', emoji: '🍕'},
    {id: 2, name: 'Burger', emoji: '🍔'},
    {id: 3, name: 'Sushi', emoji: '🍣'},
    {id: 4, name: 'Pasta', emoji: '🍝'},
    {id: 5, name: 'Salad', emoji: '🥗'},
    {id: 6, name: 'Desserts', emoji: '🍰'},
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      category: 'Pizza',
      price: 299,
      description: 'Classic cheese and tomato pizza',
      image: '🍕',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Veg Burger',
      category: 'Burger',
      price: 149,
      description: 'Delicious veggie burger',
      image: '🍔',
      rating: 4.2,
    },
    {
      id: 3,
      name: 'California Roll',
      category: 'Sushi',
      price: 399,
      description: 'Fresh sushi roll',
      image: '🍣',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Pasta Alfredo',
      category: 'Pasta',
      price: 249,
      description: 'Creamy pasta with cheese',
      image: '🍝',
      rating: 4.4,
    },
  ];

  const filteredItems =
    category === 'all'
      ? menuItems
      : menuItems.filter(item => item.category === category);

  const handleLogout = () => {
    navigation.navigate('Landing');
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>QuickBite</Text>
        <View style={styles.navRight}>
          {showSearch ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search food..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setShowSearch(true)}>
              <Text style={styles.navIcon}>🔍</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <View style={styles.cartIcon}>
              <Text style={styles.navIcon}>🛒</Text>
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.navIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>
              Order Your favorite food here
            </Text>
            <TouchableOpacity style={styles.viewMenuButton}>
              <Text style={styles.viewMenuText}>View Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Explore Menu */}
        <View style={styles.exploreMenu}>
          <Text style={styles.exploreTitle}>Explore our menu</Text>
          <Text style={styles.exploreSubtitle}>
            Explore the authentic menu from our restaurant
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}>
            <TouchableOpacity
              style={[
                styles.categoryItem,
                category === 'all' && styles.categoryItemActive,
              ]}
              onPress={() => setCategory('all')}>
              <Text style={styles.categoryEmoji}>🍽️</Text>
              <Text style={styles.categoryName}>All</Text>
            </TouchableOpacity>
            {categories.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryItem,
                  category === item.name && styles.categoryItemActive,
                ]}
                onPress={() => setCategory(item.name)}>
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Display Menu */}
        <View style={styles.displayMenu}>
          <Text style={styles.menuTitle}>Top dishes near you</Text>
          <View style={styles.menuGrid}>
            {filteredItems.map(item => (
              <View key={item.id} style={styles.foodCard}>
                <Text style={styles.foodEmoji}>{item.image}</Text>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.foodFooter}>
                    <Text style={styles.foodPrice}>₹{item.price}</Text>
                    <Text style={styles.foodRating}>⭐ {item.rating}</Text>
                  </View>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>What our customers say</Text>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.feedbackText}>
              "Amazing food and quick delivery! Highly recommend QuickBite for
              anyone looking for quality meals."
            </Text>
            <Text style={styles.feedbackAuthor}>- Happy Customer</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>QuickBite</Text>
          <Text style={styles.footerText}>
            Delicious food delivered fast. Enjoy a variety of cuisines and
            quick service with QuickBite!
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>
            © 2025 QuickBite. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  navIcon: {
    fontSize: 24,
  },
  searchInput: {
    width: 150,
    height: 35,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  cartIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 300,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewMenuButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  viewMenuText: {
    color: '#ff6b35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exploreMenu: {
    padding: 20,
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exploreSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  categoryList: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    minWidth: 80,
  },
  categoryItemActive: {
    backgroundColor: '#fff5f2',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  categoryEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  displayMenu: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  foodEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 10,
  },
  foodInfo: {
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  foodDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  foodRating: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feedbackStars: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  feedbackAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  footerLink: {
    fontSize: 14,
    color: '#fff',
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
});

export default UserScreen;
