// src/components/TwitterUserModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface TwitterUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  evmAddress?: string; // Add evmAddress as a prop
}

const TwitterUserModal: React.FC<TwitterUserModalProps> = ({ isOpen, onClose, evmAddress }) => {
  const [isVerified, setIsVerified] = useState<boolean | string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && evmAddress) {
      const url = `https://main-500474063246.us-central1.run.app/is_intent_verified?evm_address=${evmAddress}&intent=follow&intent_id=1714501947070533632`;
      
      axios.get(url)
        .then((response) => {
          const message = response.data.message;
          const error = response.data.error;
          if (message === 'Intent is verified') {
            setIsVerified(true);
          } else if (message === 'Intent not yet verified, it usually takes an hour.') {
            setIsVerified(message);
          } else if (message === 'Intent not found') {
            setIsVerified(false);
          } else if (error === 'Verify Twitter first!') {
            setIsVerified(error);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setIsVerified('Intent not yet verified, it usually takes an hour.');
          } else {
            console.error('There was a problem checking intent verification:', error);
            setIsVerified(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, evmAddress]);

  const followCryptiTalk = () => {
    if (evmAddress && isVerified === false) {
      const url = `https://main-500474063246.us-central1.run.app/verify_twitter_intent?evm_address=${evmAddress}&intent=follow&intent_id=1714501947070533632`;

      axios
        .get(url)
        .then((response) => {
          console.log('Success:', response.data);
          window.open('https://twitter.com/intent/follow?screen_name=cryptitalk', '_blank');
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      console.error('EVM Address is not provided or intent is already verified');
    }
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (isVerified === true) return 'Already Verified';
    if (isVerified === 'Intent not yet verified, it usually takes an hour.') return 'Verification Pending';
    if (isVerified === 'Verify Twitter first!') return 'Verify Twitter';
    return 'Follow @cryptitalk';
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Follow us on Twitter</h2>
        <p className="mb-4">Follow @cryptitalk on Twitter for updates!</p>
        {isVerified === 'Intent not yet verified, it usually takes an hour.' && (
          <p className="mb-4 text-yellow-600">{isVerified}</p>
        )}
        {isVerified === 'Verify Twitter first!' && (
          <p className="mb-4 text-red-600">{isVerified}</p>
        )}
        <button
          onClick={followCryptiTalk}
          disabled={loading || isVerified !== false}
          className={`font-bold py-2 px-4 rounded ${
            loading || isVerified !== false ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          {getButtonText()}
        </button>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default TwitterUserModal;