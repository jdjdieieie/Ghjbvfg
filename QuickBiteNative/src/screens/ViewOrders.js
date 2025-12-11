import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';

const ViewOrders = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('orders');
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: 1,
      orderDate: '2024-12-10',
      orderTime: '14:30:00',
      orderStatus: 'PENDING',
      customerName: 'John Doe',
      customerId: 101,
      totalQty: 3,
      totalPrice: 850,
      orderAddress: {
        phoneNo: '9876543210',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pin: '400001',
      },
      orderItems: [
        {foodName: 'Margherita Pizza', quantity: 1, price: 299, subtotal: 299},
        {foodName: 'Chicken Burger', quantity: 2, price: 199, subtotal: 398},
        {foodName: 'French Fries', quantity: 1, price: 99, subtotal: 99},
      ],
      deliveryPartnerId: null,
      assignDeliveryPerson: null,
    },
    {
      id: 2,
      orderDate: '2024-12-10',
      orderTime: '13:15:00',
      orderStatus: 'OUT',
      customerName: 'Jane Smith',
      customerId: 102,
      totalQty: 2,
      totalPrice: 550,
      orderAddress: {
        phoneNo: '9876543211',
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pin: '110001',
      },
      orderItems: [
        {foodName: 'Caesar Salad', quantity: 1, price: 149, subtotal: 149},
        {foodName: 'Pasta Alfredo', quantity: 1, price: 349, subtotal: 349},
      ],
      deliveryPartnerId: 201,
      assignDeliveryPerson: 'Rahul Kumar',
    },
    {
      id: 3,
      orderDate: '2024-12-09',
      orderTime: '19:45:00',
      orderStatus: 'DELIVERED',
      customerName: 'Mike Johnson',
      customerId: 103,
      totalQty: 4,
      totalPrice: 1200,
      orderAddress: {
        phoneNo: '9876543212',
        street: '789 Lake View',
        city: 'Bangalore',
        state: 'Karnataka',
        pin: '560001',
      },
      orderItems: [
        {foodName: 'Pepperoni Pizza', quantity: 2, price: 399, subtotal: 798},
        {foodName: 'Garlic Bread', quantity: 2, price: 99, subtotal: 198},
      ],
      deliveryPartnerId: 202,
      assignDeliveryPerson: 'Priya Sharma',
    },
  ]);

  const [deliveryPartners, setDeliveryPartners] = useState([
    {
      id: 201,
      name: 'Rahul Kumar',
      email: 'rahul@delivery.com',
      phno: '9988776655',
      location: 'Mumbai',
      availabilityStatus: true,
    },
    {
      id: 202,
      name: 'Priya Sharma',
      email: 'priya@delivery.com',
      phno: '9988776656',
      location: 'Bangalore',
      availabilityStatus: true,
    },
    {
      id: 203,
      name: 'Amit Patel',
      email: 'amit@delivery.com',
      phno: '9988776657',
      location: 'Delhi',
      availabilityStatus: false,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = status => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return '#f59e0b';
      case 'OUT':
        return '#3b82f6';
      case 'DELIVERED':
        return '#10b981';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (orderDate, orderTime) => {
    if (!orderDate) return 'N/A';
    try {
      const dateStr = `${orderDate}${orderTime ? 'T' + orderTime : ''}`;
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: orderTime ? '2-digit' : undefined,
        minute: orderTime ? '2-digit' : undefined,
      });
    } catch (error) {
      return orderDate;
    }
  };

  const assignDeliveryPartner = (orderId, partnerId) => {
    const partner = deliveryPartners.find(p => p.id === partnerId);
    setOrders(
      orders.map(order =>
        order.id === orderId
          ? {
              ...order,
              deliveryPartnerId: partnerId,
              assignDeliveryPerson: partner.name,
              orderStatus: 'OUT',
            }
          : order,
      ),
    );
    setAssigningOrder(null);
    Alert.alert('Success', 'Delivery partner assigned successfully');
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'PENDING').length,
    out: orders.filter(o => o.orderStatus === 'OUT').length,
    delivered: orders.filter(o => o.orderStatus === 'DELIVERED').length,
  };

  const partnerStats = {
    total: deliveryPartners.length,
    available: deliveryPartners.filter(p => p.availabilityStatus).length,
    unavailable: deliveryPartners.filter(p => !p.availabilityStatus).length,
  };

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
          <Text style={styles.headerTitle}>Order Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage orders and deliveries
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('AdminMenu');
              }}>
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

            <TouchableOpacity style={styles.menuItem}>
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
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        visible={assigningOrder !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAssigningOrder(null)}>
        <View style={styles.assignModalOverlay}>
          <View style={styles.assignModalContent}>
            <View style={styles.assignModalHeader}>
              <Text style={styles.assignModalTitle}>
                Assign Delivery Partner
              </Text>
              <TouchableOpacity onPress={() => setAssigningOrder(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.partnersListModal}>
              {deliveryPartners.map(partner => (
                <View
                  key={partner.id}
                  style={[
                    styles.partnerOption,
                    !partner.availabilityStatus &&
                      styles.partnerOptionUnavailable,
                  ]}>
                  <View style={styles.partnerOptionInfo}>
                    <View style={styles.partnerNameRow}>
                      <Text style={styles.partnerOptionName}>
                        {partner.name}
                      </Text>
                      <View
                        style={[
                          styles.availabilityBadgeSmall,
                          partner.availabilityStatus
                            ? styles.availabilityBadgeAvailable
                            : styles.availabilityBadgeUnavailable,
                        ]}>
                        <Text
                          style={[
                            styles.availabilityBadgeText,
                            partner.availabilityStatus
                              ? styles.availabilityTextAvailable
                              : styles.availabilityTextUnavailable,
                          ]}>
                          {partner.availabilityStatus
                            ? 'Available'
                            : 'Unavailable'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.partnerOptionDetail}>
                      ID: {partner.id}
                    </Text>
                    <Text style={styles.partnerOptionDetail}>
                      Phone: {partner.phno}
                    </Text>
                    <Text style={styles.partnerOptionDetail}>
                      Location: {partner.location || 'N/A'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.assignPartnerBtn,
                      !partner.availabilityStatus &&
                        styles.assignPartnerBtnDisabled,
                    ]}
                    onPress={() =>
                      assignDeliveryPartner(assigningOrder, partner.id)
                    }
                    disabled={!partner.availabilityStatus}>
                    <Text
                      style={[
                        styles.assignPartnerBtnText,
                        !partner.availabilityStatus &&
                          styles.assignPartnerBtnTextDisabled,
                      ]}>
                      {partner.availabilityStatus ? 'Assign' : 'Not Available'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Tabs */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'orders' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('orders')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'orders' && styles.tabButtonTextActive,
            ]}>
            All Orders ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'partners' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('partners')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'partners' && styles.tabButtonTextActive,
            ]}>
            Delivery Partners ({deliveryPartners.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {selectedTab === 'orders' ? (
          <View style={styles.ordersSection}>
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{stats.total}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={styles.statValue}>{stats.pending}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Out</Text>
                <Text style={styles.statValue}>{stats.out}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Delivered</Text>
                <Text style={styles.statValue}>{stats.delivered}</Text>
              </View>
            </View>

            {/* Orders List */}
            <View style={styles.ordersList}>
              {orders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderId}>Order #{order.id}</Text>
                      <Text style={styles.orderDate}>
                        {formatDate(order.orderDate, order.orderTime)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {backgroundColor: getStatusColor(order.orderStatus)},
                      ]}>
                      <Text style={styles.statusText}>
                        {order.orderStatus}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.customerInfo}>
                    <View style={styles.customerDetail}>
                      <Text style={styles.detailLabel}>Customer:</Text>
                      <Text style={styles.detailValue}>
                        {order.customerName}
                      </Text>
                    </View>
                    <View style={styles.customerDetail}>
                      <Text style={styles.detailLabel}>Phone:</Text>
                      <Text style={styles.detailValue}>
                        {order.orderAddress?.phoneNo}
                      </Text>
                    </View>
                    <View style={styles.customerDetail}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>
                        {order.orderAddress
                          ? `${order.orderAddress.street}, ${order.orderAddress.city}, ${order.orderAddress.state} - ${order.orderAddress.pin}`
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderItems}>
                    <Text style={styles.itemsTitle}>
                      Order Items ({order.orderItems?.length || 0})
                    </Text>
                    {order.orderItems?.map((item, index) => (
                      <View key={index} style={styles.orderItem}>
                        <Text style={styles.itemName}>{item.foodName}</Text>
                        <View style={styles.itemPriceRow}>
                          <Text style={styles.itemQuantity}>
                            x{item.quantity}
                          </Text>
                          <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.orderSummary}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Total Quantity:</Text>
                      <Text style={styles.summaryValue}>{order.totalQty}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.summaryTotal]}>
                      <Text style={styles.summaryLabelBold}>Total Price:</Text>
                      <Text style={styles.summaryValueBold}>
                        ₹{order.totalPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderActions}>
                    {order.deliveryPartnerId ? (
                      <View style={styles.assignedPartner}>
                        <Text style={styles.assignedText}>
                          Assigned to:{' '}
                          <Text style={styles.assignedName}>
                            {order.assignDeliveryPerson}
                          </Text>
                        </Text>
                        <Text style={styles.assignedId}>
                          Partner ID: {order.deliveryPartnerId}
                        </Text>
                      </View>
                    ) : (
                      order.orderStatus === 'PENDING' && (
                        <TouchableOpacity
                          style={styles.assignBtn}
                          onPress={() => setAssigningOrder(order.id)}>
                          <Text style={styles.assignBtnText}>
                            Assign Delivery Partner
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.partnersSection}>
            {/* Partner Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{partnerStats.total}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Available</Text>
                <Text style={styles.statValue}>{partnerStats.available}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Unavailable</Text>
                <Text style={styles.statValue}>
                  {partnerStats.unavailable}
                </Text>
              </View>
            </View>

            {/* Partners List */}
            <View style={styles.partnersList}>
              {deliveryPartners.map(partner => (
                <View key={partner.id} style={styles.partnerCard}>
                  <View style={styles.partnerHeader}>
                    <View>
                      <Text style={styles.partnerName}>{partner.name}</Text>
                      <Text style={styles.partnerPhone}>{partner.phno}</Text>
                    </View>
                    <View
                      style={[
                        styles.availabilityBadge,
                        partner.availabilityStatus
                          ? styles.availabilityBadgeAvailable
                          : styles.availabilityBadgeUnavailable,
                      ]}>
                      <Text
                        style={[
                          styles.availabilityBadgeText,
                          partner.availabilityStatus
                            ? styles.availabilityTextAvailable
                            : styles.availabilityTextUnavailable,
                        ]}>
                        {partner.availabilityStatus
                          ? 'Available'
                          : 'Unavailable'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.partnerDetails}>
                    <Text style={styles.partnerDetailText}>
                      <Text style={styles.partnerDetailLabel}>Email: </Text>
                      {partner.email}
                    </Text>
                    <Text style={styles.partnerDetailText}>
                      <Text style={styles.partnerDetailLabel}>Location: </Text>
                      {partner.location || 'N/A'}
                    </Text>
                    <Text style={styles.partnerDetailText}>
                      <Text style={styles.partnerDetailLabel}>
                        Partner ID:{' '}
                      </Text>
                      {partner.id}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
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
  menuButton: {
    marginRight: 12,
    padding: 8,
  },
  menuIcon: {
    fontSize: 28,
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#000',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  ordersSection: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  orderDate: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  customerInfo: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  customerDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1a202c',
    flex: 1,
    fontWeight: '500',
  },
  orderItems: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#1a202c',
    flex: 1,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6c757d',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  orderSummary: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTotal: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1a202c',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  orderActions: {
    marginTop: 8,
  },
  assignedPartner: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
  },
  assignedText: {
    fontSize: 14,
    color: '#155724',
  },
  assignedName: {
    fontWeight: 'bold',
  },
  assignedId: {
    fontSize: 12,
    color: '#155724',
    marginTop: 4,
  },
  assignBtn: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  partnersSection: {
    flex: 1,
  },
  partnersList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  partnerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  partnerPhone: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  availabilityBadgeAvailable: {
    backgroundColor: '#d4edda',
  },
  availabilityBadgeUnavailable: {
    backgroundColor: '#f8d7da',
  },
  availabilityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  availabilityTextAvailable: {
    color: '#155724',
  },
  availabilityTextUnavailable: {
    color: '#721c24',
  },
  partnerDetails: {},
  partnerDetailText: {
    fontSize: 14,
    color: '#1a202c',
    marginBottom: 6,
  },
  partnerDetailLabel: {
    fontWeight: '600',
    color: '#495057',
  },
  assignModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  assignModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  assignModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  assignModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  partnersListModal: {
    padding: 20,
  },
  partnerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  partnerOptionUnavailable: {
    opacity: 0.6,
  },
  partnerOptionInfo: {
    flex: 1,
    marginRight: 12,
  },
  partnerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnerOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  availabilityBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  partnerOptionDetail: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 4,
  },
  assignPartnerBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  assignPartnerBtnDisabled: {
    backgroundColor: '#6c757d',
  },
  assignPartnerBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  assignPartnerBtnTextDisabled: {
    color: '#e2e8f0',
  },
});

export default ViewOrders;
