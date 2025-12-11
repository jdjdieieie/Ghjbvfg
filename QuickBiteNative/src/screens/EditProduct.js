import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';

const EditProduct = ({navigation, route}) => {
  const product = route.params?.product;

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    description: '',
    category: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Pizza',
    'Burgers',
    'Salads',
    'Beverages',
    'Desserts',
    'Main Course',
    'Appetizers',
    'Chinese',
    'Indian',
    'Italian',
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        image: product.img || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        category:
          product.category?.categoryName || product.category?.name || '',
      });
    } else {
      Alert.alert(
        'Error',
        'No product data found. Redirecting to menu...',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('AdminMenu'),
          },
        ],
      );
    }
  }, [product, navigation]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !product) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Food item updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AdminMenu'),
        },
      ]);
    }, 1000);
  };

  const handleReset = () => {
    if (product) {
      setFormData({
        name: product.name || '',
        image: product.img || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        category:
          product.category?.categoryName || product.category?.name || '',
      });
      setErrors({});
      Alert.alert('Info', 'Form reset to original values');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Edit Product</Text>
          <Text style={styles.headerSubtitle}>Update food item details</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Product Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              placeholder="Enter product name"
              placeholderTextColor="#999"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          {/* Image URL */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL *</Text>
            <TextInput
              style={[styles.input, errors.image && styles.inputError]}
              value={formData.image}
              onChangeText={text => handleChange('image', text)}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}
            <Text style={styles.helpText}>
              Enter the full URL of the food image
            </Text>
          </View>

          {/* Price */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={formData.price}
              onChangeText={text => handleChange('price', text)}
              placeholder="299"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    formData.category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => handleChange('category', cat)}>
                  <Text
                    style={[
                      styles.categoryChipText,
                      formData.category === cat &&
                        styles.categoryChipTextActive,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              value={formData.description}
              onChangeText={text => handleChange('description', text)}
              placeholder="Enter product description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              disabled={loading}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.submitBtnText}>
                {loading ? 'Updating...' : 'Update Product'}
              </Text>
            </TouchableOpacity>
          </View>
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
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#1a202c',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    marginTop: 6,
  },
  helpText: {
    color: '#6c757d',
    fontSize: 13,
    marginTop: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProduct;
