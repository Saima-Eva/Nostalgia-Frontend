# Nostalgia Frontend

A comprehensive React-based social networking and health management platform frontend. Nostalgia provides features for social connectivity, friend management, group interactions, medication tracking, event management, and video communication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Features Overview](#features-overview)
- [License](#license)

## ✨ Features

- **Social Connectivity**: Friend discovery, friend management, and user profiles
- **Group Management**: Create, manage, and participate in groups
- **Chat System**: Real-time messaging with Socket.IO integration
- **Video Communication**: Video calling capabilities using PeerJS and SimplePeer
- **Medication Tracking**: Track and manage medications with caregiving features
- **Event Management**: Create and manage events and trips
- **Walking Buddy**: Community walking partner matching
- **Notifications**: Real-time notification system
- **Post & Comments**: Create posts, share content, and engage with comments
- **Authentication**: JWT-based secure authentication

## 🛠 Tech Stack

### Frontend Framework & Libraries
- **React** (v18.2.0) - UI library
- **React Router DOM** (v6.22.3) - Client-side routing
- **React Hook Form** (v7.51.3) - Form state management

### UI Component Libraries
- **Material-UI** (@mui/material, @mui/icons-material) - Component library and icons
- **Mantine** (@mantine/core, @mantine/hooks) - Modern React components
- **Bootstrap** (v5.3.3) - Responsive design framework
- **React Bootstrap** (v2.10.2) - Bootstrap React integration
- **FontAwesome** (@fortawesome/react-fontawesome) - Icon library
- **React Icons** (v4.12.0) - Icon set

### Styling
- **Styled Components** (v6.1.8) - CSS-in-JS styling
- **Emotion** (@emotion/react, @emotion/styled) - CSS-in-JS library

### Communication & APIs
- **Socket.IO Client** (v4.8.1) - Real-time bidirectional communication
- **Axios** (v1.6.8) - HTTP client
- **PeerJS** (v1.5.4) - WebRTC wrapper for peer-to-peer communication
- **Simple Peer** (v9.11.1) - Simple WebRTC peer-to-peer library
- **WebSocket** (v1.0.34) - WebSocket client

### Utilities
- **JWT Decode** (v4.0.0) - JWT token decoding
- **Date FNS** (v2.30.0) - Date manipulation
- **Moment** (v2.29.4) - Date/time library
- **Emoji Picker React** (v4.4.12) - Emoji selection component

### Testing & Development
- **React Scripts** (v5.0.1) - Create React App build tools
- **Testing Library** - React, Jest DOM testing utilities

## 📁 Project Structure

```
src/
├── api/                      # API integration and service calls
├── assets/                   # Static assets (images, icons, etc.)
├── chat_lib/                 # Chat functionality library
├── Components/               # Reusable React components
│   ├── auth/                # Authentication components
│   ├── chatbody/            # Chat interface components
│   ├── Comments/            # Comment components
│   ├── Navigation/          # Navigation bar components
│   ├── Profile/             # Profile-related components
│   ├── Post/                # Post display components
│   ├── sidebar/             # Sidebar navigation
│   ├── LeftSide/            # Left panel components
│   ├── MiddleSide/          # Center content components
│   ├── RightSide/           # Right sidebar components
│   └── ...                  # Additional component folders
├── Pages/                    # Page-level components
│   ├── Home/                # Home page
│   ├── Profile/             # User profile page
│   ├── Chat/                # Chat interface page
│   ├── Groups/              # Group management pages
│   ├── FindFriend/          # Friend discovery page
│   ├── Medication/          # Medication tracking page
│   ├── Event/               # Event management page
│   ├── Trip/                # Trip planning page
│   ├── WalkingBuddy/        # Walking buddy matching page
│   ├── Caregiver/           # Caregiving features page
│   ├── Notification/        # Notifications page
│   └── ...                  # Additional pages
├── screens/                 # Screen/layout specific components
├── context/                 # React Context for state management
├── Data/                    # Static data and constants
├── util/                    # Utility functions and helpers
├── App.js                   # Main App component
├── index.js                 # Entry point
├── index.css                # Global styles
└── setupProxy.js            # Proxy configuration for development

public/
├── index.html               # HTML template
└── manifest.json            # PWA manifest
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nostalgia-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure proxy** (if needed)
   - Edit `src/setupProxy.js` to configure your backend API endpoints

4. **Environment Setup**
   - Ensure backend services are running at the configured endpoints
   - Default homepage is set to `http://127.0.0.1:3000/`

## 📜 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Opens [http://localhost:3000](http://localhost:3000) in the browser. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. Correctly bundles React in production mode and optimizes the build.

### `npm run deploy`
Deploys the built app to GitHub Pages (requires `gh-pages` configuration).

### `npm run eject`
Ejects from Create React App configuration (this is a one-way operation).

## 🎯 Features Overview

### Social Features
- User registration and authentication
- Friend search and friend request management
- User profile viewing and editing
- Post creation and sharing
- Comments and engagement

### Communication
- Real-time chat messaging
- Group chat support
- Video calling capabilities
- Notification system

### Health & Wellness
- Medication tracking and management
- Caregiver support features
- Walking buddy matching for fitness activities
- Event and trip organization

### Community
- Group creation and management
- Event management and RSVP
- Community discussions




