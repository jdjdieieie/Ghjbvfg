import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';

const LandingPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'}}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>QuickBite</Text>
          <Text style={styles.subtitle}>Order delivery near you</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.searchIcon}>📍</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your delivery location"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.findButton}>
            <Text style={styles.findButtonText}>Find Food Near Me</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>QuickBite</Text>
          <Text style={styles.footerSubtext}>
            Delicious food delivered fast
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    opacity: 0.7,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  findButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  authButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  authButtonText: {
    color: '#ff6b35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
});

export default LandingPage;
