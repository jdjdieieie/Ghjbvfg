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

const CartScreen = ({navigation}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      foodId: 1,
      foodName: 'Margherita Pizza',
      price: 299,
      quantity: 2,
      totalPrice: 598,
      image: '🍕',
      inStock: true,
    },
    {
      id: 2,
      foodId: 2,
      foodName: 'Veg Burger',
      price: 149,
      quantity: 1,
      totalPrice: 149,
      image: '🍔',
      inStock: true,
    },
    {
      id: 3,
      foodId: 3,
      foodName: 'Pasta Alfredo',
      price: 249,
      quantity: 1,
      totalPrice: 249,
      image: '🍝',
      inStock: false,
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = 30;
  const total = subtotal + deliveryCharge - discountAmount;

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim() === '') {
      return;
    }
    // Mock promo code validation
    if (promoCode === 'SAVE20') {
      setDiscountAmount(subtotal * 0.2);
      setPromoApplied(true);
    } else {
      setDiscountAmount(0);
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscountAmount(0);
  };

  const handleProceedToCheckout = () => {
    // Navigate to place order screen with promo state
    navigation.navigate('PlaceOrder', {
      promoState: promoApplied
        ? {
            isPromocodeApplied: true,
            code: promoCode,
            discountAmount: discountAmount,
          }
        : {isPromocodeApplied: false},
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Cart Items */}
        <View style={styles.cartItems}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartEmoji}>🛒</Text>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Cart Header */}
              <View style={styles.cartHeader}>
                <Text style={[styles.headerCell, {flex: 1}]}>Item</Text>
                <Text style={[styles.headerCell, {flex: 1.5}]}>Title</Text>
                <Text style={[styles.headerCell, {flex: 0.8}]}>Price</Text>
                <Text style={[styles.headerCell, {flex: 0.6}]}>Qty</Text>
                <Text style={[styles.headerCell, {flex: 0.8}]}>Total</Text>
                <Text style={[styles.headerCell, {flex: 0.5}]}></Text>
              </View>

              {/* Cart Items List */}
              {cartItems.map(item => (
                <View key={item.id}>
                  <View style={styles.cartItem}>
                    <Text style={[styles.itemCell, {flex: 1, fontSize: 30}]}>
                      {item.image}
                    </Text>
                    <View style={[styles.itemCell, {flex: 1.5}]}>
                      <Text style={styles.itemName}>{item.foodName}</Text>
                      <View style={styles.stockBadge}>
                        <Text
                          style={[
                            styles.stockText,
                            {color: item.inStock ? '#4caf50' : '#f44336'},
                          ]}>
                          {item.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.itemCell, {flex: 0.8}]}>
                      ₹{item.price}
                    </Text>
                    <View style={[styles.itemCell, {flex: 0.6}]}>
                      <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                      </View>
                    </View>
                    <Text style={[styles.itemCell, {flex: 0.8, fontWeight: 'bold'}]}>
                      ₹{item.totalPrice}
                    </Text>
                    <TouchableOpacity
                      style={[styles.itemCell, {flex: 0.5}]}
                      onPress={() => handleRemoveItem(item.id)}>
                      <Text style={styles.removeButton}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                </View>
              ))}
            </>
          )}
        </View>

        {/* Cart Totals */}
        {cartItems.length > 0 && (
          <View style={styles.cartTotals}>
            <Text style={styles.totalsTitle}>Cart Totals</Text>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Charges</Text>
              <Text style={styles.totalValue}>₹{deliveryCharge}</Text>
            </View>

            {promoApplied && (
              <>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Promo Discount</Text>
                  <Text style={styles.discountValue}>
                    -₹{discountAmount.toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>₹{total.toFixed(2)}</Text>
            </View>

            {/* Promo Code Section */}
            <View style={styles.promoSection}>
              <View style={styles.promoHeader}>
                <View>
                  <Text style={styles.promoTitle}>Promo code</Text>
                  <Text style={styles.promoSubtitle}>
                    Unlock extra savings on this order
                  </Text>
                </View>
                {promoApplied && (
                  <View style={styles.promoAppliedBadge}>
                    <Text style={styles.promoAppliedText}>Applied</Text>
                  </View>
                )}
              </View>

              <View style={styles.promoInputRow}>
                <TextInput
                  style={[
                    styles.promoInput,
                    promoApplied && styles.promoInputDisabled,
                  ]}
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChangeText={text => setPromoCode(text.toUpperCase())}
                  editable={!promoApplied}
                />
                {promoApplied && (
                  <TouchableOpacity
                    style={styles.promoRemove}
                    onPress={handleRemovePromo}>
                    <Text style={styles.promoRemoveText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {promoApplied && (
                <Text style={styles.promoSuccessMessage}>
                  Promo code applied successfully!
                </Text>
              )}

              {!promoApplied && (
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyPromo}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}>
              <Text style={styles.checkoutButtonText}>
                PROCEED TO CHECKOUT
              </Text>
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
    paddingTop: 40,
  },
  header: {
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
  backButton: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  scrollView: {
    flex: 1,
  },
  cartItems: {
    padding: 20,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  itemCell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stockBadge: {
    marginTop: 5,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quantityBadge: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeButton: {
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  cartTotals: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  totalsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    color: '#666',
  },
  totalValue: {
    fontSize: 15,
    color: '#333',
  },
  totalLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  discountValue: {
    fontSize: 15,
    color: '#4caf50',
    fontWeight: '600',
  },
  promoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  promoAppliedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promoAppliedText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  promoInputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  promoRemove: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  promoRemoveText: {
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold',
  },
  promoSuccessMessage: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 8,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CartScreen;
