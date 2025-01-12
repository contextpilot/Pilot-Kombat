// src/services/apiService.ts
import axios from 'axios';

const API_BASE_URL = 'https://main-wjaxre4ena-uc.a.run.app/api';

// Utility function to decide the params based on identifier type
const getFetchParams = (telegram_id: string, evm_address: string) => {
  return telegram_id !== '0000'
    ? { telegram_id }
    : { evm_address };
};

export const fetchGameData = async (telegram_id: string, evm_address: string) => {
  try {
    const params = getFetchParams(telegram_id, evm_address);
    const response = await axios.get(`${API_BASE_URL}/game-data`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
};

export const fetchUserData = async (telegram_id: string, evm_address: string) => {
  try {
    const params = getFetchParams(telegram_id, evm_address);
    const response = await axios.get(`${API_BASE_URL}/user-data`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const userCheckIn = async (telegram_id: string, evm_address: string, total_checkin_points: number) => {
  try {
    // Cast total_checkin_points to integer
    const totalCheckinPointsInt = parseInt(total_checkin_points.toString(), 10);

    // Validation check for required fields
    if (telegram_id !== '0000' && !evm_address) {
      throw new Error('EVM address is required when telegram_id is provided.');
    }

    // Construct the params object conditionally
    const params: Record<string, any> = { total_checkin_points: totalCheckinPointsInt, evm_address };
    if (telegram_id !== '0000') {
      params.telegram_id = telegram_id;
    }

    const response = await axios.get(`${API_BASE_URL}/user-checkin`, { params });
    
    // Return the new_stored_points from the server response
    return response.data;
  } catch (error) {
    console.error('Error during check-in:', error);
    return null;
  }
};