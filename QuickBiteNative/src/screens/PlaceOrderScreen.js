import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PlaceOrderScreen = ({navigation, route}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  // Mock data from cart
  const promoState = route?.params?.promoState || {
    isPromocodeApplied: false,
    discountAmount: 0,
  };

  const subtotal = 996; // Mock subtotal from cart
  const deliveryCharge = 30;
  const discountAmount = promoState.isPromocodeApplied
    ? promoState.discountAmount
    : 0;
  const finalTotal = Math.max(subtotal + deliveryCharge - discountAmount, 0);

  const validateForm = () => {
    const newErrors = {};

    if (!firstname.trim()) {
      newErrors.firstname = 'First name is required';
    } else if (!/^[a-zA-Z]+$/.test(firstname.trim())) {
      newErrors.firstname = 'First name must contain only alphabets and no spaces';
    }

    if (!lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    } else if (!/^[a-zA-Z]+$/.test(lastname.trim())) {
      newErrors.lastname = 'Last name must contain only alphabets and no spaces';
    }

    if (!street.trim()) {
      newErrors.street = 'Street is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z]+$/.test(city.trim())) {
      newErrors.city = 'City must contain only alphabets and no spaces';
    }

    if (!state.trim()) {
      newErrors.state = 'State is required';
    } else if (!/^[a-zA-Z ]+$/.test(state.trim())) {
      newErrors.state = 'Only Alphabet is required in State';
    }

    if (!zipcode.trim()) {
      newErrors.zipcode = 'Pin is required';
    } else if (!/^[0-9]{6}$/.test(zipcode)) {
      newErrors.zipcode = 'PIN code must be exactly 6 digits';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }

    // Mock order placement - navigate to My Orders
    console.log('Order placed successfully');
    navigation.navigate('MyOrders');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Delivery Information */}
        <View style={styles.deliveryInfo}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>

          {/* First Name & Last Name */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TextInput
                style={[styles.input, errors.firstname && styles.inputError]}
                placeholder="First Name"
                value={firstname}
                onChangeText={text => {
                  setFirstname(text);
                  if (errors.firstname) {
                    setErrors({...errors, firstname: ''});
                  }
                }}
              />
              {errors.firstname && (
                <Text style={styles.errorText}>{errors.firstname}</Text>
              )}
            </View>
            <View style={styles.halfWidth}>
              <TextInput
                style={[styles.input, errors.lastname && styles.inputError]}
                placeholder="Last Name"
                value={lastname}
                onChangeText={text => {
                  setLastname(text);
                  if (errors.lastname) {
                    setErrors({...errors, lastname: ''});
                  }
                }}
              />
              {errors.lastname && (
                <Text style={styles.errorText}>{errors.lastname}</Text>
              )}
            </View>
          </View>

          {/* Street */}
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, errors.street && styles.inputError]}
              placeholder="Street"
              value={street}
              onChangeText={text => {
                setStreet(text);
                if (errors.street) {
                  setErrors({...errors, street: ''});
                }
              }}
            />
            {errors.street && (
              <Text style={styles.errorText}>{errors.street}</Text>
            )}
          </View>

          {/* City & State */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                placeholder="City"
                value={city}
                onChangeText={text => {
                  setCity(text);
                  if (errors.city) {
                    setErrors({...errors, city: ''});
                  }
                }}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>
            <View style={styles.halfWidth}>
              <TextInput
                style={[styles.input, errors.state && styles.inputError]}
                placeholder="State"
                value={state}
                onChangeText={text => {
                  setState(text);
                  if (errors.state) {
                    setErrors({...errors, state: ''});
                  }
                }}
              />
              {errors.state && (
                <Text style={styles.errorText}>{errors.state}</Text>
              )}
            </View>
          </View>

          {/* Zip Code */}
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, errors.zipcode && styles.inputError]}
              placeholder="Zip Code (6 digits)"
              value={zipcode}
              onChangeText={text => {
                setZipcode(text);
                if (errors.zipcode) {
                  setErrors({...errors, zipcode: ''});
                }
              }}
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.zipcode && (
              <Text style={styles.errorText}>{errors.zipcode}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Phone (10 digits)"
              value={phone}
              onChangeText={text => {
                setPhone(text);
                if (errors.phone) {
                  setErrors({...errors, phone: ''});
                }
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>
        </View>

        {/* Cart Totals */}
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

          {promoState.isPromocodeApplied && discountAmount > 0 && (
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
            <Text style={styles.totalValueBold}>₹{finalTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  deliveryInfo: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginBottom: 10,
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
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  placeOrderButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default PlaceOrderScreen;
