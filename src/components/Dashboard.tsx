import React from 'react';
import { dailyReward, dailyCipher, dailyCombo, mouse, dollarCoin } from '../images';


interface DashboardProps {
  points: number;
  dailyRewardTimeLeft: string;
  dailyCipherTimeLeft: string;
  dailyComboTimeLeft: string;
  handleCardClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ points, dailyRewardTimeLeft, dailyCipherTimeLeft, dailyComboTimeLeft, handleCardClick }) => (
  <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
    <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
      <div className="px-4 mt-6 flex justify-between gap-2">
        <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
          <div className="dot"></div>
          <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
          <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
          <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
        </div>
        <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
          <div className="dot"></div>
          <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
          <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
          <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
        </div>
        <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
          <div className="dot"></div>
          <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
          <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
          <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
        </div>
      </div>

      <div className="px-4 mt-4 flex justify-center">
        <div className="px-4 py-2 flex items-center space-x-2">
          <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
          <p className="text-4xl text-white">{points.toLocaleString()}</p>
        </div>
      </div>

      <div className="px-4 mt-4 flex justify-center">
        <div className="w-80 h-80 p-4 rounded-full circle-outer" onClick={handleCardClick}>
          <div className="w-full h-full rounded-full circle-inner">
            <img src={mouse} alt="Main Character" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;