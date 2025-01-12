// src/components/FooterNavigation.tsx
import React, { useState } from 'react';
import { binanceLogo, hamsterCoin } from '../images';
import Coins from '../icons/Coins';
import Friends from '../icons/Friends';
import Mine from '../icons/Mine';
import TwitterVerificationModal from './TwitterVerificationModal';
import TwitterUserModal from './TwitterUserModal';
import TwitterIntentModal from './TwitterIntentModal';

interface FooterNavigationProps {
  onClick: (section: string) => void;
  evmAddress?: string;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ onClick, evmAddress }) => {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isVerificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [isTwitterUserModalOpen, setTwitterUserModalOpen] = useState<boolean>(false);
  const [isTwitterIntentModalOpen, setTwitterIntentModalOpen] = useState<boolean>(false);

  const handleClick = (section: string) => {
    setSelectedSection(section); // Set the clicked section as the selected section

    if (section === 'Friends') {
      setVerificationModalOpen(true); // Open the verification modal if Friends is clicked
    }

    if (section === 'Mine') {
      setTwitterUserModalOpen(true); // Open the Twitter user modal if Mine is clicked
    }

    if (section === 'Earn') {
      setTwitterIntentModalOpen(true); // Open the Twitter intent modal if Earn is clicked
    }

    onClick(section); // Notify the parent component
  };

  const handleCloseVerificationModal = () => {
    setVerificationModalOpen(false);
  };

  const handleCloseTwitterUserModal = () => {
    setTwitterUserModalOpen(false);
  };

  const handleCloseTwitterIntentModal = () => {
    setTwitterIntentModalOpen(false);
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
          <p className="mt-1">Withdraw</p>
        </div>
      </div>
      <TwitterVerificationModal isOpen={isVerificationModalOpen} onClose={handleCloseVerificationModal} evmAddress={evmAddress} />
      <TwitterUserModal isOpen={isTwitterUserModalOpen} onClose={handleCloseTwitterUserModal} evmAddress={evmAddress} />
      <TwitterIntentModal isOpen={isTwitterIntentModalOpen} onClose={handleCloseTwitterIntentModal} evmAddress={evmAddress} />
    </div>
  );
};

export default FooterNavigation;