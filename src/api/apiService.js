import ApiConnector from './apiConnector';
import ApiEndpoints from './apiEndpoints';

/**
 * Authentication API Service
 */
export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise}
   */
  login: async (credentials) => {
    try {
      const body = JSON.stringify(credentials);
      const response = await ApiConnector.sendPostRequest(
        'login_api/',
        body,
        false,
        false
      );
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise}
   */
  register: async (userData) => {
    try {
      const body = JSON.stringify(userData);
      const response = await ApiConnector.sendPostRequest(
        'sign/',
        body,
        false,
        false
      );
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Get user profile
   * @param {string} username - Username
   * @returns {Promise}
   */
  getProfile: async (username) => {
    try {
      const response = await ApiConnector.sendGetRequest(
        `profile/${username}/`
      );
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} username - Username
   * @param {Object} updateData - Data to update
   * @returns {Promise}
   */
  updateProfile: async (username, updateData) => {
    try {
      const body = JSON.stringify(updateData);
      const response = await ApiConnector.sendPostRequest(
        `Owner_update/${username}/`,
        body,
        true,
        false
      );
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - { username, old_password, new_password }
   * @returns {Promise}
   */
  changePassword: async (passwordData) => {
    try {
      const body = JSON.stringify(passwordData);
      const response = await ApiConnector.sendPostRequest(
        'change_password/',
        body,
        true,
        false
      );
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Request OTP
   * @param {string} username - Username or email
   * @returns {Promise}
   */
  requestOTP: async (username) => {
    try {
      const body = JSON.stringify({ input: username });
      const response = await ApiConnector.sendPostRequest(
        'otp/',
        body,
        false,
        false
      );
      return response;
    } catch (error) {
      console.error('Request OTP error:', error);
      throw error;
    }
  },
};

/**
 * Friends API Service
 */
export const friendsAPI = {
  /**
   * Get friend list
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  getFriendList: async (userId) => {
    try {
      const response = await ApiConnector.sendGetRequest(
        `friends/?user_id=${userId}`
      );
      return response;
    } catch (error) {
      console.error('Get friend list error:', error);
      throw error;
    }
  },

  /**
   * Add friend
   * @param {Object} data - { user_id, friend_id, type }
   * @returns {Promise}
   */
  addFriend: async (data) => {
    try {
      const body = JSON.stringify(data);
      const response = await ApiConnector.sendPostRequest(
        'add_fnf/',
        body,
        true,
        false
      );
      return response;
    } catch (error) {
      console.error('Add friend error:', error);
      throw error;
    }
  },

  /**
   * Delete friend
   * @param {Object} data - { user_id, friend_id }
   * @returns {Promise}
   */
  deleteFriend: async (data) => {
    try {
      const body = JSON.stringify(data);
      const response = await ApiConnector.sendPostRequest(
        'delete_friend/',
        body,
        true,
        false
      );
      return response;
    } catch (error) {
      console.error('Delete friend error:', error);
      throw error;
    }
  },
};

/**
 * Blog API Service
 */
export const blogAPI = {
  /**
   * Get all blogs
   * @param {string} username - Username (optional)
   * @returns {Promise}
   */
  getAllBlogs: async (username) => {
    try {
      const url = username 
        ? `blogs/?username=${username}` 
        : 'blogs/';
      const response = await ApiConnector.sendGetRequest(url);
      return response;
    } catch (error) {
      console.error('Get all blogs error:', error);
      throw error;
    }
  },

  /**
   * Get user blogs
   * @param {string} username - Username
   * @returns {Promise}
   */
  getUserBlogs: async (username) => {
    try {
      const response = await ApiConnector.sendGetRequest(
        `blogs/single/?username=${username}`
      );
      return response;
    } catch (error) {
      console.error('Get user blogs error:', error);
      throw error;
    }
  },

  /**
   * Create blog
   * @param {FormData} formData - Blog data with image
   * @returns {Promise}
   */
  createBlog: async (formData) => {
    try {
      const response = await ApiConnector.sendPostRequest(
        'blogs/create/',
        formData,
        true,
        true
      );
      return response;
    } catch (error) {
      console.error('Create blog error:', error);
      throw error;
    }
  },

  /**
   * Upvote blog
   * @param {Object} data - { id, username }
   * @returns {Promise}
   */
  upvoteBlog: async (data) => {
    try {
      const body = JSON.stringify(data);
      const response = await ApiConnector.sendPostRequest(
        'upvote/',
        body,
        true,
        false
      );
      return response;
    } catch (error) {
      console.error('Upvote blog error:', error);
      throw error;
    }
  },
};

/**
 * Notification API Service
 */
export const notificationAPI = {
  /**
   * Get notifications
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  getNotifications: async (userId) => {
    try {
      const response = await ApiConnector.sendGetRequest(
        `notifications/?user_id=${userId}`
      );
      return response;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },
};

/**
 * Event API Service
 */
export const eventAPI = {
  /**
   * Get all events
   * @returns {Promise}
   */
  getAllEvents: async () => {
    try {
      const response = await ApiConnector.sendGetRequest('events/');
      return response;
    } catch (error) {
      console.error('Get all events error:', error);
      throw error;
    }
  },

  /**
   * Create event
   * @param {Object} eventData - Event data
   * @returns {Promise}
   */
  createEvent: async (eventData) => {
    try {
      const body = JSON.stringify(eventData);
      const response = await ApiConnector.sendPostRequest(
        'events/create/',
        body,
        true,
        false
      );
      return response;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },
};
