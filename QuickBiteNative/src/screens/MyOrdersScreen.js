import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';

const MyOrdersScreen = ({navigation}) => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      otp: '1234',
      assignDeliveryPerson: 'Raj Kumar',
      orderStatus: 'DELIVERED',
      orderDate: '2025-01-10T10:30:00',
      orderTime: '10:30:00',
      totalPrice: 1026,
      totalQty: 3,
      orderItems: [
        {
          foodId: 1,
          foodName: 'Margherita Pizza',
          quantity: 2,
          price: 299,
          isRated: false,
        },
        {
          foodId: 2,
          foodName: 'Veg Burger',
          quantity: 1,
          price: 149,
          isRated: true,
        },
      ],
    },
    {
      id: 2,
      otp: '5678',
      orderStatus: 'PENDING',
      orderDate: '2025-01-11T14:15:00',
      orderTime: '14:15:00',
      totalPrice: 647,
      totalQty: 2,
      orderItems: [
        {
          foodId: 3,
          foodName: 'Pasta Alfredo',
          quantity: 1,
          price: 249,
        },
        {
          foodId: 4,
          foodName: 'California Roll',
          quantity: 1,
          price: 399,
        },
      ],
    },
    {
      id: 3,
      orderStatus: 'OUT_FOR_DELIVERY',
      assignDeliveryPerson: 'Amit Singh',
      orderDate: '2025-01-11T16:00:00',
      orderTime: '16:00:00',
      totalPrice: 448,
      totalQty: 2,
      orderItems: [
        {
          foodId: 5,
          foodName: 'Caesar Salad',
          quantity: 2,
          price: 199,
        },
      ],
    },
  ]);

  const [ratingStates, setRatingStates] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRatingItem, setSelectedRatingItem] = useState(null);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = status => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'delivered':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'out_for_delivery':
      case 'out-for-delivery':
        return '#2196f3';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const formatStatus = status => {
    return (status || 'Pending')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleRateFood = (orderId, foodId, rating) => {
    // Mock rating submission
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            orderItems: order.orderItems.map(item => {
              if (item.foodId === foodId) {
                return {...item, isRated: true, rating: rating};
              }
              return item;
            }),
          };
        }
        return order;
      }),
    );
    setShowRatingModal(false);
    setSelectedRatingItem(null);
  };

  const openRatingModal = (orderId, foodId, foodName) => {
    setSelectedRatingItem({orderId, foodId, foodName});
    setShowRatingModal(true);
  };

  const handleCancelOrder = orderId => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setOrders(prevOrders =>
              prevOrders.map(order => {
                if (order.id === orderId) {
                  return {...order, orderStatus: 'CANCELLED'};
                }
                return order;
              }),
            );
          },
        },
      ],
    );
  };

  const handleTrackOrder = () => {
    Alert.alert('Track Order', 'Order tracking feature coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Food</Text>
            <Text style={styles.modalSubtitle}>
              {selectedRatingItem?.foodName}
            </Text>

            <View style={styles.ratingOptions}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={styles.ratingOption}
                  onPress={() =>
                    handleRateFood(
                      selectedRatingItem.orderId,
                      selectedRatingItem.foodId,
                      rating,
                    )
                  }>
                  <Text style={styles.ratingStars}>
                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                  </Text>
                  <Text style={styles.ratingNumber}>({rating})</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowRatingModal(false);
                setSelectedRatingItem(null);
              }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        {orders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Text style={styles.emptyOrdersEmoji}>📦</Text>
            <Text style={styles.emptyOrdersText}>No orders found</Text>
            <Text style={styles.emptyOrdersSubtext}>
              Start ordering now!
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('User')}>
              <Text style={styles.shopButtonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    {order.otp && (
                      <Text style={styles.orderOtp}>OTP: {order.otp}</Text>
                    )}
                    {order.assignDeliveryPerson && (
                      <Text style={styles.deliveryPartner}>
                        Delivery Partner: {order.assignDeliveryPerson}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getStatusColor(order.orderStatus)},
                    ]}>
                    <Text style={styles.statusText}>
                      {formatStatus(order.orderStatus)}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View style={styles.orderItems}>
                  {order.orderItems.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.foodName}</Text>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemQuantity}>
                            x{item.quantity}
                          </Text>
                          <Text style={styles.itemPrice}>₹{item.price}</Text>
                        </View>
                      </View>

                      {/* Rating for delivered items */}
                      {order.orderStatus?.toLowerCase() === 'delivered' && (
                        <View style={styles.ratingSection}>
                          {item.isRated ? (
                            <View style={styles.ratedBadge}>
                              <Text style={styles.ratingStar}>★</Text>
                              <Text style={styles.ratedText}>Rated</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.rateButton}
                              onPress={() =>
                                openRatingModal(order.id, item.foodId, item.foodName)
                              }>
                              <Text style={styles.rateButtonText}>
                                Rate Food
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderDate}>
                      {formatDate(order.orderDate)}
                      {order.orderTime &&
                        ` at ${order.orderTime.substring(0, 5)}`}
                    </Text>
                    <Text style={styles.orderTotal}>₹{order.totalPrice}</Text>
                    <Text style={styles.orderQty}>
                      Total Items: {order.totalQty}
                    </Text>
                  </View>

                  <View style={styles.orderActions}>
                    {order.orderStatus?.toUpperCase() === 'PENDING' && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelOrder(order.id)}>
                        <Text style={styles.cancelButtonText}>
                          CANCEL ORDER
                        </Text>
                      </TouchableOpacity>
                    )}
                    {order.orderStatus?.toLowerCase() !== 'delivered' &&
                      order.orderStatus?.toUpperCase() !== 'CANCELLED' && (
                        <TouchableOpacity
                          style={styles.trackButton}
                          onPress={handleTrackOrder}>
                          <Text style={styles.trackButtonText}>
                            TRACK ORDER
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </View>

                {/* Order ID */}
                <View style={styles.orderIdFooter}>
                  <Text style={styles.orderId}>Order ID: {order.id}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyOrdersEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyOrdersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyOrdersSubtext: {
    fontSize: 16,
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
  ordersList: {
    padding: 15,
    paddingBottom: 50,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderOtp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 5,
  },
  deliveryPartner: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItems: {
    padding: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#666',
    marginRight: 15,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  ratingSection: {
    marginLeft: 10,
  },
  ratedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingStar: {
    fontSize: 14,
    color: '#ffc107',
    marginRight: 5,
  },
  ratedText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  rateButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  orderQty: {
    fontSize: 13,
    color: '#666',
  },
  orderActions: {
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderIdFooter: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderId: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  ratingOptions: {
    gap: 12,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  ratingStars: {
    fontSize: 20,
    color: '#ffc107',
    marginRight: 10,
  },
  ratingNumber: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MyOrdersScreen;
