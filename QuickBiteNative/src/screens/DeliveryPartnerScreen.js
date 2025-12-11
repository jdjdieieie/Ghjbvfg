import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

const DeliveryPartnerScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isAvailable, setIsAvailable] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock partner data
  const [partnerData, setPartnerData] = useState({
    id: 'DP001',
    name: 'Raj Kumar',
    email: 'raj.kumar@delivery.com',
    phno: '9876543210',
    location: 'Mumbai, Maharashtra',
    totalOrders: 145,
  });

  const [updateFormData, setUpdateFormData] = useState({
    name: partnerData.name,
    email: partnerData.email,
    phno: partnerData.phno,
    location: partnerData.location,
    password: '',
  });

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderStatus: 'PENDING',
      totalPrice: 899,
      totalQty: 3,
      orderAddress: {
        firstName: 'Amit',
        lastName: 'Sharma',
        phoneNo: '9988776655',
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pin: '400001',
      },
      orderItems: [
        {name: 'Pizza', quantity: 2},
        {name: 'Burger', quantity: 1},
      ],
    },
    {
      id: 2,
      orderStatus: 'OUT',
      totalPrice: 549,
      totalQty: 2,
      orderAddress: {
        firstName: 'Priya',
        lastName: 'Singh',
        phoneNo: '8877665544',
        street: '456 Park Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pin: '400002',
      },
      orderItems: [{name: 'Pasta', quantity: 2}],
    },
  ]);

  const handleLogout = () => {
    navigation.navigate('Landing');
  };

  const handleMarkAsPickedUp = orderId => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? {...order, orderStatus: 'OUT'} : order,
      ),
    );
    Alert.alert('Success', 'Order marked as picked up!');
  };

  const handleMarkAsDelivered = order => {
    setSelectedOrder(order);
    setShowOtpModal(true);
  };

  const verifyOtpAndDeliver = () => {
    if (!otpInput || otpInput.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    // Mock OTP verification
    setOrders(prevOrders =>
      prevOrders.filter(order => order.id !== selectedOrder.id),
    );
    setShowOtpModal(false);
    setOtpInput('');
    setSelectedOrder(null);
    Alert.alert('Success', 'Order marked as delivered!');
  };

  const handleUpdateProfile = () => {
    setUpdateFormData({
      name: partnerData.name,
      email: partnerData.email,
      phno: partnerData.phno,
      location: partnerData.location,
      password: '',
    });
    setShowUpdateModal(true);
  };

  const submitProfileUpdate = () => {
    if (!updateFormData.name || !updateFormData.email || !updateFormData.phno) {
      Alert.alert('Error', 'Name, Email, and Phone are required');
      return;
    }

    if (!updateFormData.password) {
      Alert.alert('Error', 'Password is required to update profile');
      return;
    }

    // Mock profile update
    setPartnerData({
      ...partnerData,
      name: updateFormData.name,
      email: updateFormData.email,
      phno: updateFormData.phno,
      location: updateFormData.location,
    });
    setShowUpdateModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const getStatusColor = status => {
    switch (status) {
      case 'PENDING':
        return '#ff9800';
      case 'OUT':
        return '#2196f3';
      case 'DELIVERED':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const renderProfile = () => {
    return (
      <ScrollView style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>
              {partnerData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>{partnerData.name}</Text>
          <Text style={styles.profileRole}>Delivery Partner</Text>
          <View
            style={[
              styles.availabilityBadge,
              {backgroundColor: isAvailable ? '#4caf50' : '#999'},
            ]}>
            <Text style={styles.availabilityText}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}>
              <Text style={styles.updateButtonText}>✎ Update</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{partnerData.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{partnerData.phno}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{partnerData.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Partner ID:</Text>
            <Text style={styles.infoValue}>{partnerData.id}</Text>
          </View>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Delivery Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{partnerData.totalOrders}</Text>
              <Text style={styles.statLabel}>Total Deliveries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </Text>
              <Text style={styles.statLabel}>Current Status</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderOrders = () => {
    if (orders.length === 0) {
      return (
        <View style={styles.noOrders}>
          <Text style={styles.noOrdersEmoji}>📦</Text>
          <Text style={styles.noOrdersTitle}>No Orders Assigned</Text>
          <Text style={styles.noOrdersText}>
            You don't have any orders assigned at the moment.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.ordersGrid}>
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Order #{order.id}</Text>
              <View
                style={[
                  styles.orderStatusBadge,
                  {backgroundColor: getStatusColor(order.orderStatus)},
                ]}>
                <Text style={styles.orderStatusText}>{order.orderStatus}</Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.customerInfo}>
                <Text style={styles.detailsTitle}>Customer Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>
                    {order.orderAddress.firstName} {order.orderAddress.lastName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>
                    {order.orderAddress.phoneNo}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>
                    {order.orderAddress.street}, {order.orderAddress.city},{' '}
                    {order.orderAddress.state} - {order.orderAddress.pin}
                  </Text>
                </View>
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.detailsTitle}>Order Summary</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={styles.detailValue}>₹{order.totalPrice}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment:</Text>
                  <Text style={styles.detailValue}>COD</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Items:</Text>
                  <Text style={styles.detailValue}>{order.totalQty} items</Text>
                </View>
              </View>
            </View>

            <View style={styles.orderActions}>
              {order.orderStatus === 'PENDING' && (
                <TouchableOpacity
                  style={styles.pickupButton}
                  onPress={() => handleMarkAsPickedUp(order.id)}>
                  <Text style={styles.pickupButtonText}>
                    Mark as Picked Up
                  </Text>
                </TouchableOpacity>
              )}
              {order.orderStatus === 'OUT' && (
                <TouchableOpacity
                  style={styles.deliverButton}
                  onPress={() => handleMarkAsDelivered(order)}>
                  <Text style={styles.deliverButtonText}>
                    Mark as Delivered
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Delivery Partner</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.signoutButton}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setActiveTab('profile')}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileCircleText}>
                {partnerData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      {activeTab === 'profile' && (
        <View style={styles.tabNavigation}>
          <TouchableOpacity onPress={() => setActiveTab('orders')}>
            <Text style={styles.backButton}>← Back to Orders</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'profile' ? (
          renderProfile()
        ) : (
          <View style={styles.ordersSection}>
            <View style={styles.sectionHeaderOrders}>
              <Text style={styles.ordersTitle}>
                Assigned Orders ({orders.length})
              </Text>
              <View style={styles.headerActions}>
                <View style={styles.availabilityToggle}>
                  <Text style={styles.toggleLabel}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </Text>
                  <Switch
                    value={isAvailable}
                    onValueChange={setIsAvailable}
                    trackColor={{false: '#ccc', true: '#4caf50'}}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            </View>
            {renderOrders()}
          </View>
        )}
      </View>

      {/* OTP Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOtpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify Delivery OTP</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowOtpModal(false);
                  setOtpInput('');
                  setSelectedOrder(null);
                }}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Please enter the 6-digit OTP provided by the customer:
            </Text>

            <TextInput
              style={styles.otpInput}
              value={otpInput}
              onChangeText={text =>
                setOtpInput(text.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="Enter 6-digit OTP"
              keyboardType="numeric"
              maxLength={6}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowOtpModal(false);
                  setOtpInput('');
                  setSelectedOrder(null);
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={verifyOtpAndDeliver}>
                <Text style={styles.verifyButtonText}>Verify & Deliver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Profile Modal */}
      <Modal
        visible={showUpdateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUpdateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.updateModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              <TouchableOpacity onPress={() => setShowUpdateModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={updateFormData.name}
                  onChangeText={text =>
                    setUpdateFormData({...updateFormData, name: text})
                  }
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={updateFormData.email}
                  onChangeText={text =>
                    setUpdateFormData({...updateFormData, email: text})
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.formInput}
                  value={updateFormData.phno}
                  onChangeText={text =>
                    setUpdateFormData({...updateFormData, phno: text})
                  }
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.formInput}
                  value={updateFormData.location}
                  onChangeText={text =>
                    setUpdateFormData({...updateFormData, location: text})
                  }
                  placeholder="Enter your location"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Password *</Text>
                <TextInput
                  style={styles.formInput}
                  value={updateFormData.password}
                  onChangeText={text =>
                    setUpdateFormData({...updateFormData, password: text})
                  }
                  placeholder="Enter your password"
                  secureTextEntry
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowUpdateModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.updateProfileButton}
                onPress={submitProfileUpdate}>
                <Text style={styles.updateProfileButtonText}>
                  Update Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  signoutButton: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
  headerRight: {
    marginLeft: 15,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabNavigation: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    paddingBottom: 50,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  availabilityBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  ordersSection: {
    flex: 1,
  },
  sectionHeaderOrders: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  noOrders: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noOrdersEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  noOrdersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  ordersGrid: {
    flex: 1,
    padding: 15,
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
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  orderStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    padding: 15,
  },
  customerInfo: {
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  orderInfo: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderActions: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  pickupButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickupButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deliverButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deliverButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
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
  updateModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 450,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 5,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  verifyButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  updateProfileButton: {
    flex: 1,
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateProfileButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
});

export default DeliveryPartnerScreen;
