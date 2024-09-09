import axios from 'axios';

export const fetchGameData = async (telegram_id: string) => {
  try {
    const response = await axios.get(`https://main-wjaxre4ena-uc.a.run.app/api/game-data?telegram_id=${telegram_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
};

export const fetchUserData = async (telegram_id: string) => {
  try {
    const response = await axios.get(`https://main-wjaxre4ena-uc.a.run.app/api/user-data?telegram_id=${telegram_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const userCheckIn = async (telegram_id: string, evm_address: string, total_checkin_points: number) => {
  try {
    await axios.get(`https://main-wjaxre4ena-uc.a.run.app/api/user-checkin`, {
        params: {
          telegram_id,
          evm_address,
          total_checkin_points,
        },
      });
  } catch (error) {
    console.error('Error during check-in:', error);
  }
};