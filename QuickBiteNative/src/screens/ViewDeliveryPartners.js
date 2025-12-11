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

const ViewDeliveryPartners = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [allPartners, setAllPartners] = useState([
    {
      id: 201,
      name: 'Rahul Kumar',
      email: 'rahul.kumar@delivery.com',
      phno: '9988776655',
      location: 'Mumbai, Maharashtra',
      availabilityStatus: true,
      totalOrders: 45,
    },
    {
      id: 202,
      name: 'Priya Sharma',
      email: 'priya.sharma@delivery.com',
      phno: '9988776656',
      location: 'Bangalore, Karnataka',
      availabilityStatus: true,
      totalOrders: 38,
    },
    {
      id: 203,
      name: 'Amit Patel',
      email: 'amit.patel@delivery.com',
      phno: '9988776657',
      location: 'Delhi, Delhi',
      availabilityStatus: false,
      totalOrders: 52,
    },
    {
      id: 204,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@delivery.com',
      phno: '9988776658',
      location: 'Hyderabad, Telangana',
      availabilityStatus: true,
      totalOrders: 29,
    },
    {
      id: 205,
      name: 'Vikram Singh',
      email: 'vikram.singh@delivery.com',
      phno: '9988776659',
      location: 'Pune, Maharashtra',
      availabilityStatus: false,
      totalOrders: 61,
    },
    {
      id: 206,
      name: 'Anjali Verma',
      email: 'anjali.verma@delivery.com',
      phno: '9988776660',
      location: 'Chennai, Tamil Nadu',
      availabilityStatus: true,
      totalOrders: 34,
    },
  ]);

  const [partners, setPartners] = useState(allPartners);

  const onRefresh = () => {
    setRefreshing(true);
    setSearchTerm('');
    setPartners(allPartners);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setPartners(allPartners);
      return;
    }

    const filtered = allPartners.filter(partner =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setPartners(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPartners(allPartners);
  };

  const deletePartner = (partnerId, partnerName) => {
    Alert.alert(
      'Delete Delivery Partner',
      `Are you sure you want to delete delivery partner "${partnerName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedPartners = allPartners.filter(p => p.id !== partnerId);
            setAllPartners(updatedPartners);
            setPartners(updatedPartners);
            Alert.alert('Success', 'Delivery partner deleted successfully');
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
          <Text style={styles.headerTitle}>Delivery Partner Management</Text>
          <Text style={styles.headerSubtitle}>
            View and manage delivery partners
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ViewCustomers');
              }}>
              <Text style={styles.menuItemText}>View Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
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
            placeholder="Search delivery partners by name..."
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
            All Delivery Partners ({partners.length})
          </Text>
        </View>

        {/* Partners List */}
        {partners.length === 0 ? (
          <View style={styles.noPartners}>
            <Text style={styles.noPartnersText}>
              No delivery partners found matching your search criteria.
            </Text>
          </View>
        ) : (
          <View style={styles.partnersGrid}>
            {partners.map(partner => (
              <View key={partner.id} style={styles.partnerCard}>
                <View style={styles.partnerHeader}>
                  <View style={styles.partnerAvatar}>
                    <Text style={styles.partnerAvatarText}>
                      {partner.name && partner.name.trim()
                        ? partner.name.charAt(0).toUpperCase()
                        : '?'}
                    </Text>
                  </View>
                  <View style={styles.partnerBasicInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerId}>ID: #{partner.id}</Text>
                  </View>
                  {partner.availabilityStatus !== null && (
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
                  )}
                </View>

                <View style={styles.partnerDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{partner.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>
                      {partner.phno || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>
                      {partner.location || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Orders:</Text>
                    <Text style={styles.detailValueBold}>
                      {partner.totalOrders || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.partnerActions}>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deletePartner(partner.id, partner.name)}>
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
  noPartners: {
    padding: 40,
    alignItems: 'center',
  },
  noPartnersText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  partnersGrid: {
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
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  partnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  partnerAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  partnerBasicInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  partnerId: {
    fontSize: 13,
    color: '#6c757d',
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
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
  partnerDetails: {
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
  partnerActions: {
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

export default ViewDeliveryPartners;
