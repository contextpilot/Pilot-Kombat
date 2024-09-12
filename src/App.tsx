// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import WebApp from '@twa-dev/sdk';
import _ from 'lodash';

import UserProfile from './components/UserProfile';
import LevelProgress from './components/LevelProgress';
import Dashboard from './components/Dashboard';
import FooterNavigation from './components/FooterNavigation';
import VerificationModal from './components/VerificationModal';
import FloatingPoints from './components/FloatingPoints';
import ProfitInfo from './components/ProfitInfo';
import { fetchGameData, fetchUserData, userCheckIn } from './services/apiService';

interface TelegramWebApp {
  onEvent(eventType: 'web_app_close', callback: () => void): void;
  offEvent(eventType: 'web_app_close', callback: () => void): void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

const App: React.FC = () => {
  interface UserInfo {
    first_name: string;
    last_name: string;
    username: string;
    init: boolean;
    telegram_id?: string;
    evm_address?: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo>({
    first_name: 'pilot',
    last_name: 'kombat',
    username: '',
    init: false,
  });

  const [verificationWarning, setVerificationWarning] = useState({
    show: false,
    message: ''
  });

  const { slug } = useParams<{ slug?: string }>();
  const [telegramCode, setTelegramCode] = useState(slug || '');
  const [isVerified, setIsVerified] = useState(false);

  const [levelNames, setLevelNames] = useState<string[]>([]);
  const [levelMinPoints, setLevelMinPoints] = useState<number[]>([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [profitPerHour, setProfitPerHour] = useState(0);

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  useEffect(() => {
    if (WebApp && !userInfo.init) {
      const { first_name = '', last_name = '', username = '', id = '0000' } = WebApp.initDataUnsafe.user || {};
      const telegram_id = id.toString();
      setUserInfo(prev => ({ ...prev, first_name, last_name, username, init: true, telegram_id }));

      const verificationParam = telegram_id !== '0000' ? `telegram_id=${telegram_id}` : `telegram_code=${telegramCode}`;
      const verificationUrl = `https://main-wjaxre4ena-uc.a.run.app/is_telegram_verified?${verificationParam}`;

      axios.get(verificationUrl)
        .then(response => {
          if (response.data.telegram_id_verified) {
            setIsVerified(true);
            setUserInfo(prev => ({ ...prev, evm_address: response.data.evm_address }));
          } else {
            setVerificationWarning({ show: true, message: 'Please verify your Telegram ID with the provided code.' });
          }
        })
        .catch(err => {
          console.error('Verification check failed:', err);
          setVerificationWarning({ show: true, message: 'Verification check failed. Please try again.' });
        });
    }
  }, [userInfo.init, telegramCode]);

  useEffect(() => {
    const initializeGameData = async () => {
      try {
        const gameDataResponse = await fetchGameData(userInfo.telegram_id || '0000', userInfo.evm_address || '');
        const userDataResponse = await fetchUserData(userInfo.telegram_id || '0000', userInfo.evm_address || '');

        if (gameDataResponse) {
          setLevelNames(gameDataResponse.levelNames);
          setLevelMinPoints(gameDataResponse.levelMinPoints);
          setPointsToAdd(gameDataResponse.pointsToAdd);
        }

        if (userDataResponse) {
          setPoints(userDataResponse.points);
          setProfitPerHour(userDataResponse.profitPerHour);
          setLevelIndex(userDataResponse.levelIndex);
        }
      } catch (error) {
        console.error('Error initializing game data:', error);
      }
    };

    if (userInfo.telegram_id !== '0000' || userInfo.evm_address) {
      initializeGameData();
    }
  }, [userInfo.telegram_id, userInfo.evm_address]);

  const handleVerificationSubmit = () => {
    if (userInfo.telegram_id && telegramCode) {
      axios.post(`https://main-wjaxre4ena-uc.a.run.app/verify_telegram_account`, {
        telegram_id: userInfo.telegram_id,
        telegram_code: telegramCode,
      })
      .then(response => {
        setIsVerified(true);
        setUserInfo(prev => ({ ...prev, evm_address: response.data.evm_address }));
        setVerificationWarning({ show: true, message: 'Your Telegram ID has been successfully verified!' });
      })
      .catch(err => {
        console.error('Verification failed:', err);
        setVerificationWarning({ show: true, message: 'Verification failed. Please try again.' });
      });
    }
  };

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVerified) {
      setVerificationWarning({ show: true, message: 'Please verify your Telegram ID with the provided code.' });
      return;
    }

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;

    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    let accumulatedPoints = 0;
    const pointsPerSecond = profitPerHour / 3600.0; // Use floating-point division for more accurate points calculation
    const interval = setInterval(() => {
      accumulatedPoints += pointsPerSecond;
      if (accumulatedPoints >= 1) {
        setPoints(prevPoints => prevPoints + Math.floor(accumulatedPoints));
        accumulatedPoints -= Math.floor(accumulatedPoints); // Retain the fractional part
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const debouncedCheckIn = useCallback(
    _.debounce(async (telegram_id: string, evm_address: string, total_checkin_points: number) => {
      await userCheckIn(telegram_id, evm_address, total_checkin_points);
    }, 500), // debounce delay of 5 seconds
    []
  );

  useEffect(() => {
    if ((userInfo.telegram_id || userInfo.evm_address) && points > 0) {
      debouncedCheckIn(userInfo.telegram_id || '', userInfo.evm_address || '', points);
    }
  }, [points, userInfo.telegram_id, userInfo.evm_address, debouncedCheckIn]);

  const handleVerificationModalClose = () => {
    if (userInfo.evm_address) {
      setIsVerified(true);
    }
    setVerificationWarning({ show: false, message: '' });
  };

  const handleUserProfileClick = () => {
    setIsVerified(false);
    setVerificationWarning({ show: true, message: 'You can update your Telegram ID with the provided code.' });
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <UserProfile 
            firstName={userInfo.first_name} 
            lastName={userInfo.last_name} 
            username={userInfo.username}
            isVerified={isVerified}
            evmAddress={userInfo.evm_address}
            onClick={handleUserProfileClick} 
          />
          <div className="flex items-center justify-between space-x-4 mt-1">
            <LevelProgress 
              levelNames={levelNames}
              levelIndex={levelIndex}
              points={points}
              levelMinPoints={levelMinPoints}
            />
            <ProfitInfo 
              profitPerHour={profitPerHour}
              formatProfitPerHour={formatProfitPerHour}
            />
          </div>
        </div>

        <Dashboard 
          points={points}
          dailyRewardTimeLeft={dailyRewardTimeLeft}
          dailyCipherTimeLeft={dailyCipherTimeLeft}
          dailyComboTimeLeft={dailyComboTimeLeft}
          handleCardClick={handleCardClick}
        />
      </div>

      <FooterNavigation />

      <VerificationModal 
        isOpen={verificationWarning.show}
        message={verificationWarning.message}
        onClose={handleVerificationModalClose}
        isVerified={isVerified}
        telegramCode={telegramCode}
        onTelegramCodeChange={(e) => setTelegramCode(e.target.value)}
        onSubmit={handleVerificationSubmit}
      />

      <FloatingPoints 
        clicks={clicks}
        pointsToAdd={pointsToAdd}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};

export default App;