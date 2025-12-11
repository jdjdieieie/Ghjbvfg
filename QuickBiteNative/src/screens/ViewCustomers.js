import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';

const ViewCustomers = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [allCustomers, setAllCustomers] = useState([
    {
      id: 101,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phno: '9876543210',
      location: 'Mumbai, Maharashtra',
      totalOrders: 15,
    },
    {
      id: 102,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phno: '9876543211',
      location: 'Delhi, Delhi',
      totalOrders: 8,
    },
    {
      id: 103,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phno: '9876543212',
      location: 'Bangalore, Karnataka',
      totalOrders: 22,
    },
    {
      id: 104,
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      phno: '9876543213',
      location: 'Chennai, Tamil Nadu',
      totalOrders: 12,
    },
    {
      id: 105,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phno: '9876543214',
      location: 'Pune, Maharashtra',
      totalOrders: 5,
    },
    {
      id: 106,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phno: '9876543215',
      location: 'Hyderabad, Telangana',
      totalOrders: 18,
    },
  ]);

  const [customers, setCustomers] = useState(allCustomers);

  const onRefresh = () => {
    setRefreshing(true);
    setSearchTerm('');
    setCustomers(allCustomers);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setCustomers(allCustomers);
      return;
    }

    const filtered = allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setCustomers(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCustomers(allCustomers);
  };

  const deleteCustomer = (customerId, customerName) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete customer "${customerName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCustomers = allCustomers.filter(
              c => c.id !== customerId,
            );
            setAllCustomers(updatedCustomers);
            setCustomers(updatedCustomers);
            Alert.alert('Success', 'Customer deleted successfully');
          },
        },
      ],
    );
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
          <Text style={styles.headerTitle}>Customer Management</Text>
          <Text style={styles.headerSubtitle}>
            View and manage customers
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ViewOrders');
              }}>
              <Text style={styles.menuItemText}>View Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
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

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers by name..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
          {searchTerm !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            All Customers ({customers.length})
          </Text>
        </View>

        {/* Customers List */}
        {customers.length === 0 ? (
          <View style={styles.noCustomers}>
            <Text style={styles.noCustomersText}>
              No customers found matching your search criteria.
            </Text>
          </View>
        ) : (
          <View style={styles.customersGrid}>
            {customers.map(customer => (
              <View key={customer.id} style={styles.customerCard}>
                <View style={styles.customerHeader}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerAvatarText}>
                      {customer.name && customer.name.trim()
                        ? customer.name.charAt(0).toUpperCase()
                        : '?'}
                    </Text>
                  </View>
                  <View style={styles.customerBasicInfo}>
                    <Text style={styles.customerName}>
                      {customer.name || 'N/A'}
                    </Text>
                    <Text style={styles.customerId}>ID: #{customer.id}</Text>
                  </View>
                </View>

                <View style={styles.customerDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{customer.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>
                      {customer.phno || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>
                      {customer.location || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Orders:</Text>
                    <Text style={styles.detailValueBold}>
                      {customer.totalOrders || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.customerActions}>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      deleteCustomer(
                        customer.id,
                        customer.name || 'Unknown Customer',
                      )
                    }>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
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
  searchSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a202c',
  },
  searchButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  noCustomers: {
    padding: 40,
    alignItems: 'center',
  },
  noCustomersText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  customersGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  customerCard: {
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
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerBasicInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  customerId: {
    fontSize: 13,
    color: '#6c757d',
  },
  customerDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a202c',
    flex: 1,
    textAlign: 'right',
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  customerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ViewCustomers;
