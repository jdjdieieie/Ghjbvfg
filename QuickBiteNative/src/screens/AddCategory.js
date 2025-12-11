import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Alert,
  Image,
} from 'react-native';

const AddCategory = ({navigation}) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryImage: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

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

    if (name === 'categoryImage') {
      setImageError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }

    if (!formData.categoryImage.trim()) {
      newErrors.categoryImage = 'Category image URL is required';
    } else if (!formData.categoryImage.match(/^https?:\/\/.+/i)) {
      newErrors.categoryImage =
        'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Category added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            handleReset();
            navigation.navigate('AdminMenu');
          },
        },
      ]);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      categoryName: '',
      categoryImage: '',
    });
    setErrors({});
    setImageError(false);
  };

  const isValidImageUrl =
    formData.categoryImage &&
    formData.categoryImage.match(/^https?:\/\/.+/i) &&
    !imageError;

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
          <Text style={styles.headerTitle}>Add Category</Text>
          <Text style={styles.headerSubtitle}>
            Add new category to organize menu
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Category Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category Name *</Text>
            <TextInput
              style={[styles.input, errors.categoryName && styles.inputError]}
              value={formData.categoryName}
              onChangeText={text => handleChange('categoryName', text)}
              placeholder="e.g., Salad, Rolls, Deserts"
              placeholderTextColor="#999"
            />
            {errors.categoryName && (
              <Text style={styles.errorText}>{errors.categoryName}</Text>
            )}
            <Text style={styles.helpText}>
              This will be used to group your food items
            </Text>
          </View>

          {/* Category Image URL */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category Image URL *</Text>
            <TextInput
              style={[
                styles.input,
                errors.categoryImage && styles.inputError,
              ]}
              value={formData.categoryImage}
              onChangeText={text => handleChange('categoryImage', text)}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.categoryImage && (
              <Text style={styles.errorText}>{errors.categoryImage}</Text>
            )}
            <Text style={styles.helpText}>
              Provide a valid URL for the category image
            </Text>

            {/* Image Preview */}
            {isValidImageUrl && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.previewLabel}>Image Preview:</Text>
                <Image
                  source={{uri: formData.categoryImage}}
                  style={styles.imagePreview}
                  onError={() => setImageError(true)}
                  resizeMode="cover"
                />
              </View>
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
                {loading ? 'Adding...' : 'Add Category'}
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
  imagePreviewContainer: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
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

export default AddCategory;
