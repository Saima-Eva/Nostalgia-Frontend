import axios from 'axios';

/**
 * Optimized friend API calls with better error handling
 */
const friendAPI = {
  /**
   * Get user's friends with pagination and filtering
   */
  getFriends: async (userId, page = 1, pageSize = 12, search = '', type = '') => {
    try {
      console.log(`[friendAPI] Getting friends: userId=${userId}, page=${page}, pageSize=${pageSize}, search=${search}, type=${type}`);
      const response = await axios.get(`/friends/optimized`, {
        params: {
          user_id: userId,
          page,
          page_size: pageSize,
          search,
          type
        }
      });
      console.log('[friendAPI] getFriends response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[friendAPI] getFriends error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch friends'
      };
    }
  },

  /**
   * Find potential friends with mutual friend count
   */
  findFriends: async (userId, page = 1, pageSize = 12, search = '', thana = '', filterType = 'all') => {
    try {
      console.log(`[friendAPI] Finding friends: userId=${userId}, page=${page}, pageSize=${pageSize}, search=${search}, thana=${thana}, filterType=${filterType}`);
      const response = await axios.get(`/findfriend/optimized`, {
        params: {
          user_id: userId,
          page,
          page_size: pageSize,
          search,
          thana,
          filter_type: filterType
        }
      });
      console.log('[friendAPI] findFriends response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[friendAPI] findFriends error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to find friends'
      };
    }
  },

  /**
   * Get mutual friends between two users
   */
  getMutualFriends: async (userId, friendId) => {
    try {
      const response = await axios.get(`/friends/mutual`, {
        params: {
          user_id: userId,
          friend_id: friendId
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching mutual friends:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch mutual friends'
      };
    }
  },

  /**
   * Get friend suggestions based on mutual friends
   */
  getSuggestions: async (userId, limit = 10) => {
    try {
      console.log(`[friendAPI] Getting suggestions: userId=${userId}, limit=${limit}`);
      const response = await axios.get(`/friends/suggestions`, {
        params: {
          user_id: userId,
          limit
        }
      });
      console.log('[friendAPI] getSuggestions response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[friendAPI] getSuggestions error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch suggestions'
      };
    }
  },

  /**
   * Send friend request
   */
  sendFriendRequest: async (userId, friendId) => {
    try {
      console.log(`[friendAPI] Sending friend request: userId=${userId}, friendId=${friendId}`);
      const response = await axios.post(`/add_fnf`, {
        user_id: userId,
        friend_id: friendId,
        type: 'Sent'
      });
      console.log('[friendAPI] sendFriendRequest response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[friendAPI] sendFriendRequest error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to send friend request'
      };
    }
  },

  /**
   * Update friend status (Accept, Block, etc)
   */
  updateFriendStatus: async (userId, friendId, type) => {
    try {
      console.log(`[friendAPI] Updating friend status: userId=${userId}, friendId=${friendId}, type=${type}`);
      const response = await axios.post(`/update_fnf`, {
        user_id: userId,
        friend_id: friendId,
        type
      });
      console.log('[friendAPI] updateFriendStatus response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[friendAPI] updateFriendStatus error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update friend status'
      };
    }
  },

  /**
   * Delete/unfriend
   */
  removeFriend: async (userId, friendId) => {
    try {
      console.log(`[friendAPI] Removing friend: userId=${userId}, friendId=${friendId}`);
      const response = await axios.post(`/delete_fnd`, {
        user_id: userId,
        friend_id: friendId,
        type: 'Delete'
      });
      console.log('[friendAPI] removeFriend response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[friendAPI] removeFriend error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to remove friend'
      };
    }
  }
};

export default friendAPI;
