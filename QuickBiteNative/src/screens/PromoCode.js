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

const PromoCode = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [promoCodes, setPromoCodes] = useState([
    {
      id: 1,
      code: 'WELCOME50',
      title: 'Welcome Offer',
      description: 'Get 50% off on your first order',
      discountType: 'PERCENTAGE',
      discountValue: 50,
      maxDiscountAmount: 200,
      minOrderAmount: 500,
      usageLimitPerCustomer: 1,
      maxRedemptions: 100,
      totalRedemptions: 45,
      validFrom: '2024-01-01T00:00:00',
      validUntil: '2024-12-31T23:59:59',
      active: true,
    },
    {
      id: 2,
      code: 'FLAT100',
      title: 'Flat Discount',
      description: 'Flat ₹100 off on orders above ₹300',
      discountType: 'FLAT',
      discountValue: 100,
      maxDiscountAmount: null,
      minOrderAmount: 300,
      usageLimitPerCustomer: 3,
      maxRedemptions: 500,
      totalRedemptions: 230,
      validFrom: '2024-01-01T00:00:00',
      validUntil: '2024-12-31T23:59:59',
      active: true,
    },
    {
      id: 3,
      code: 'SUMMER25',
      title: 'Summer Sale',
      description: '25% off - Limited time offer',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      maxDiscountAmount: 150,
      minOrderAmount: 400,
      usageLimitPerCustomer: 2,
      maxRedemptions: 200,
      totalRedemptions: 180,
      validFrom: '2024-06-01T00:00:00',
      validUntil: '2024-08-31T23:59:59',
      active: false,
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const defaultForm = {
    code: '',
    title: '',
    description: '',
    discountType: 'FLAT',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    usageLimitPerCustomer: '1',
    maxRedemptions: '',
    validFrom: '',
    validUntil: '',
    active: true,
  };

  const [formData, setFormData] = useState(defaultForm);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const stats = {
    active: promoCodes.filter(p => p.active).length,
    scheduled: 0,
    expired: 0,
    total: promoCodes.length,
  };

  const handleEdit = promo => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      title: promo.title,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      maxDiscountAmount: promo.maxDiscountAmount?.toString() || '',
      minOrderAmount: promo.minOrderAmount?.toString() || '',
      usageLimitPerCustomer: promo.usageLimitPerCustomer?.toString() || '1',
      maxRedemptions: promo.maxRedemptions?.toString() || '',
      validFrom: promo.validFrom || '',
      validUntil: promo.validUntil || '',
      active: promo.active,
    });
    setFormVisible(true);
  };

  const handleDelete = promo => {
    Alert.alert('Delete Promo Code', `Delete promo code ${promo.code}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPromoCodes(promoCodes.filter(p => p.id !== promo.id));
        },
      },
    ]);
  };

  const handleToggleActive = promo => {
    setPromoCodes(
      promoCodes.map(p =>
        p.id === promo.id ? {...p, active: !p.active} : p,
      ),
    );
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingPromo(null);
    setFormVisible(false);
  };

  const handleSubmit = () => {
    if (editingPromo) {
      setPromoCodes(
        promoCodes.map(p =>
          p.id === editingPromo.id
            ? {
                ...p,
                code: formData.code,
                title: formData.title,
                description: formData.description,
                discountType: formData.discountType,
                discountValue: parseFloat(formData.discountValue),
                maxDiscountAmount: formData.maxDiscountAmount
                  ? parseFloat(formData.maxDiscountAmount)
                  : null,
                minOrderAmount: formData.minOrderAmount
                  ? parseFloat(formData.minOrderAmount)
                  : null,
                usageLimitPerCustomer: parseInt(
                  formData.usageLimitPerCustomer,
                ),
                maxRedemptions: formData.maxRedemptions
                  ? parseInt(formData.maxRedemptions)
                  : null,
                active: formData.active,
              }
            : p,
        ),
      );
    } else {
      const newPromo = {
        id: Date.now(),
        code: formData.code,
        title: formData.title,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : null,
        minOrderAmount: formData.minOrderAmount
          ? parseFloat(formData.minOrderAmount)
          : null,
        usageLimitPerCustomer: parseInt(formData.usageLimitPerCustomer),
        maxRedemptions: formData.maxRedemptions
          ? parseInt(formData.maxRedemptions)
          : null,
        totalRedemptions: 0,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        active: formData.active,
      };
      setPromoCodes([...promoCodes, newPromo]);
    }
    resetForm();
  };

  const formatDate = value => {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  const formatCurrency = value => {
    if (!value) return '—';
    return `₹${value}`;
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
          <Text style={styles.headerTitle}>Promo Code Studio</Text>
          <Text style={styles.headerSubtitle}>Manage promotional offers</Text>
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

            <TouchableOpacity style={styles.menuItem}>
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
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Form Modal */}
      <Modal
        visible={formVisible}
        animationType="slide"
        onRequestClose={resetForm}>
        <View style={styles.formModal}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingPromo ? `Edit ${editingPromo.code}` : 'Create Promo Code'}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Code</Text>
              <TextInput
                style={styles.input}
                value={formData.code}
                onChangeText={text =>
                  setFormData({...formData, code: text.toUpperCase()})
                }
                placeholder="e.g., WELCOME50"
                editable={!editingPromo}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={text => setFormData({...formData, title: text})}
                placeholder="e.g., Welcome Offer"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={text =>
                  setFormData({...formData, description: text})
                }
                placeholder="Promo description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Discount Type</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={[
                      styles.pickerOption,
                      formData.discountType === 'FLAT' &&
                        styles.pickerOptionActive,
                    ]}
                    onPress={() =>
                      setFormData({...formData, discountType: 'FLAT'})
                    }>
                    <Text
                      style={[
                        styles.pickerText,
                        formData.discountType === 'FLAT' &&
                          styles.pickerTextActive,
                      ]}>
                      FLAT
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pickerOption,
                      formData.discountType === 'PERCENTAGE' &&
                        styles.pickerOptionActive,
                    ]}
                    onPress={() =>
                      setFormData({...formData, discountType: 'PERCENTAGE'})
                    }>
                    <Text
                      style={[
                        styles.pickerText,
                        formData.discountType === 'PERCENTAGE' &&
                          styles.pickerTextActive,
                      ]}>
                      %
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Discount Value</Text>
                <TextInput
                  style={styles.input}
                  value={formData.discountValue}
                  onChangeText={text =>
                    setFormData({...formData, discountValue: text})
                  }
                  placeholder="100"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Max Discount</Text>
                <TextInput
                  style={styles.input}
                  value={formData.maxDiscountAmount}
                  onChangeText={text =>
                    setFormData({...formData, maxDiscountAmount: text})
                  }
                  placeholder="200"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Min Order Amount</Text>
                <TextInput
                  style={styles.input}
                  value={formData.minOrderAmount}
                  onChangeText={text =>
                    setFormData({...formData, minOrderAmount: text})
                  }
                  placeholder="500"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Usage / Customer</Text>
                <TextInput
                  style={styles.input}
                  value={formData.usageLimitPerCustomer}
                  onChangeText={text =>
                    setFormData({...formData, usageLimitPerCustomer: text})
                  }
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Max Redemptions</Text>
                <TextInput
                  style={styles.input}
                  value={formData.maxRedemptions}
                  onChangeText={text =>
                    setFormData({...formData, maxRedemptions: text})
                  }
                  placeholder="100"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.picker}>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    formData.active && styles.pickerOptionActive,
                  ]}
                  onPress={() => setFormData({...formData, active: true})}>
                  <Text
                    style={[
                      styles.pickerText,
                      formData.active && styles.pickerTextActive,
                    ]}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    !formData.active && styles.pickerOptionActive,
                  ]}
                  onPress={() => setFormData({...formData, active: false})}>
                  <Text
                    style={[
                      styles.pickerText,
                      !formData.active && styles.pickerTextActive,
                    ]}>
                    Paused
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {editingPromo ? 'Update Promo' : 'Create Promo'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>{stats.active}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Scheduled</Text>
            <Text style={styles.statValue}>{stats.scheduled}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Expired</Text>
            <Text style={styles.statValue}>{stats.expired}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              setEditingPromo(null);
              setFormData(defaultForm);
              setFormVisible(true);
            }}>
            <Text style={styles.createButtonText}>+ Create Promo Code</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Codes List */}
        <View style={styles.promoList}>
          <Text style={styles.sectionTitle}>Live Promo Codes</Text>
          {promoCodes.map(promo => (
            <View key={promo.id} style={styles.promoCard}>
              <View style={styles.promoHeader}>
                <View style={styles.promoCodeContainer}>
                  <Text style={styles.promoCode}>{promo.code}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      promo.active
                        ? styles.statusActive
                        : styles.statusInactive,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        promo.active
                          ? styles.statusTextActive
                          : styles.statusTextInactive,
                      ]}>
                      {promo.active ? 'Active' : 'Paused'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.promoTitle}>{promo.title}</Text>
              </View>

              <Text style={styles.promoDescription}>{promo.description}</Text>

              <View style={styles.promoDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Discount:</Text>
                  <Text style={styles.detailValue}>
                    {promo.discountType === 'PERCENTAGE'
                      ? `${promo.discountValue}%`
                      : formatCurrency(promo.discountValue)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Min Order:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(promo.minOrderAmount)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Usage:</Text>
                  <Text style={styles.detailValue}>
                    {promo.totalRedemptions} / {promo.maxRedemptions || '∞'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Valid Until:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(promo.validUntil)}
                  </Text>
                </View>
              </View>

              <View style={styles.promoActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEdit(promo)}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toggleBtn}
                  onPress={() => handleToggleActive(promo)}>
                  <Text style={styles.toggleBtnText}>
                    {promo.active ? 'Pause' : 'Activate'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(promo)}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
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
  scrollView: {
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
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promoList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 16,
  },
  promoCard: {
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
  promoHeader: {
    marginBottom: 12,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#d4edda',
  },
  statusInactive: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#155724',
  },
  statusTextInactive: {
    color: '#721c24',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  promoDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  promoDetails: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  promoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formModal: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  formScroll: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a202c',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  picker: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  pickerOptionActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  pickerTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PromoCode;
