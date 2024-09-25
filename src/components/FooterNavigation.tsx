import React, { useState } from 'react';
import { binanceLogo, hamsterCoin } from '../images';
import Coins from '../icons/Coins';
import Friends from '../icons/Friends';
import Mine from '../icons/Mine';
import Withdraw from './Withdraw';

interface FooterNavigationProps {
  onClick: (section: string) => void;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ onClick }) => {
  const [selectedSection, setSelectedSection] = useState<string>('');

  const handleClick = (section: string) => {
    setSelectedSection(section); // Set the clicked section as the selected section
    onClick(section); // Notify the parent component
  };

  return (
    <div>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div
          className={`text-center w-1/5 m-1 p-2 rounded-2xl ${
            selectedSection === 'Exchange' ? 'bg-[#1c1f24] text-[#ffffff]' : 'text-[#85827d] bg-transparent'
          }`}
          onClick={() => handleClick('Exchange')}
        >
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </div>
        <div
          className={`text-center w-1/5 ${
            selectedSection === 'Mine' ? 'text-[#ffffff]' : 'text-[#85827d]'
          }`}
          onClick={() => handleClick('Mine')}
        >
          <Mine className="w-8 h-8 mx-auto" />
          <p className="mt-1">Mine</p>
        </div>
        <div
          className={`text-center w-1/5 ${
            selectedSection === 'Friends' ? 'text-[#ffffff]' : 'text-[#85827d]'
          }`}
          onClick={() => handleClick('Friends')}
        >
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </div>
        <div
          className={`text-center w-1/5 ${
            selectedSection === 'Earn' ? 'text-[#ffffff]' : 'text-[#85827d]'
          }`}
          onClick={() => handleClick('Earn')}
        >
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </div>
        <div
          className={`text-center w-1/5 ${selectedSection === 'Airdrop' ? 'text-[#ffffff]' : 'text-[#85827d]'}`}
          onClick={() => handleClick('Airdrop')}
        >
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </div>
      </div>
    </div>
  );
};

export default FooterNavigation;