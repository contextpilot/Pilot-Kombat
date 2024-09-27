import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TwitterVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evmAddress?: string;
}

const TwitterVerificationModal: React.FC<TwitterVerificationModalProps> = ({ isOpen, onClose, evmAddress }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTwitterVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://main-wjaxre4ena-uc.a.run.app/api/twitter/request-token', { evm_address: evmAddress });
      const { auth_url, state } = response.data; // Assuming response includes state parameter
      sessionStorage.setItem('oauth_state', state); // Store state in session storage
      
      // Open a popup window for Twitter authorization
      const popup = window.open(auth_url, '_blank', 'width=600,height=400');
      
      // Poll the popup window to check if user has completed the auth process
      const pollTimer = window.setInterval(() => {
        if (!popup || popup.closed !== false) {
          window.clearInterval(pollTimer);
          setLoading(false);
          onClose();
        }
      }, 1000);
    } catch (err) {
      setError('Failed to initiate Twitter verification');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-dark flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <h2 className="text-xl mb-4">Twitter Verification</h2>
        {error && <p className="text-red-500">{error}</p>}
        <p>Please verify your account by connecting to Twitter.</p>
        <button 
          className="mt-4 p-2 bg-blue-500 text-white rounded" 
          onClick={handleTwitterVerification}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify with Twitter'}
        </button>
        <button className="mt-4 p-2 bg-gray-500 text-white rounded" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default TwitterVerificationModal;