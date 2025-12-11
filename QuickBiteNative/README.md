# QuickBite React Native App

A React Native mobile application for QuickBite food delivery service with Landing, Login, and Signup screens.

## Features

- **Landing Page**: Beautiful hero section with search functionality and action buttons
- **Login Screen**: User authentication interface with email and password fields
- **Signup Screen**: Registration form with role selection (Customer/Delivery Partner)
- **Navigation**: Seamless navigation between screens using React Navigation

## UI Only

This is a UI-only implementation. The screens are designed to match the web application but without backend functionality.

## Installation

1. Install dependencies:
```bash
cd QuickBiteNative
npm install
```

2. For iOS (Mac only):
```bash
cd ios && pod install && cd ..
npm run ios
```

3. For Android:
```bash
npm run android
```

## Project Structure

```
QuickBiteNative/
├── App.js                      # Main app with navigation
├── src/
│   └── screens/
│       ├── LandingPage.js      # Landing page screen
│       ├── Login.js            # Login screen
│       └── Signup.js           # Signup screen
├── package.json
└── README.md
```

## Screens

### Landing Page
- Hero section with background image
- Search bar for location input
- "Find Food Near Me" button
- Login and Signup action buttons
- Footer section

### Login Screen
- Email input field
- Password input field
- Forgot password link
- Login button
- Link to signup page

### Signup Screen
- Role selection (Customer/Delivery Partner)
- Name input
- Email input
- Phone number input
- Location input
- Password input
- Signup button
- Link to login page

## Design

- **Color Scheme**: 
  - Primary: #ff6b35 (Orange)
  - Background: #fff (White)
  - Text: #333 (Dark Gray)
  
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Reusable styled components following React Native best practices

## Notes

- This is a UI-only implementation
- No API integration or backend functionality
- Form validations are visual only
- Images use placeholder URLs
