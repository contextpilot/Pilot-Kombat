import React from 'react';
import Hamster from '../icons/Hamster';

interface UserProfileProps {
  firstName: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  evmAddress?: string;
  onClick: () => void; // Add this line
}

const UserProfile: React.FC<UserProfileProps> = ({ firstName, lastName, username, isVerified, evmAddress, onClick }) => (
  <div className="flex items-center space-x-2 pt-4" onClick={onClick}> {/* Add onClick here */}
    <div className="p-1 rounded-lg bg-[#1d2025]">
      <Hamster size={24} className="text-[#d4d4d4]" />
    </div>
    <div>
      <p className="text-sm">
        {firstName} {lastName} {isVerified ? `(${evmAddress?.slice(0, 6)})` : `(${username})`}
      </p>
    </div>
  </div>
);

export default UserProfile;