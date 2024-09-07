import axios from 'axios';

export const fetchGameData = async () => {
  try {
    const response = await axios.get('https://main-wjaxre4ena-uc.a.run.app/api/game-data');
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