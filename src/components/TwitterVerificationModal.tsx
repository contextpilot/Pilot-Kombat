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
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [screenName, setScreenName] = useState<string | null>(null);

  useEffect(() => {
    const checkTwitterVerification = async () => {
      if (evmAddress) {
        try {
          const response = await axios.get(`https://main-500474063246.us-central1.run.app/is_twitter_verified?evm_address=${evmAddress}`);
          const { twitter_verified, screen_name } = response.data;
          setIsVerified(twitter_verified);
          setScreenName(twitter_verified ? screen_name : null);
        } catch (err) {
          setError('Failed to check Twitter verification status');
        }
      }
    };

    if (isOpen) {
      setError(null);
      setLoading(false);
      checkTwitterVerification();
    }
  }, [isOpen, evmAddress]);

  const handleTwitterVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://main-wjaxre4ena-uc.a.run.app/api/twitter/request-token', { evm_address: evmAddress });
      const { auth_url, state } = response.data;
      sessionStorage.setItem('oauth_state', state);

      const userAgent = navigator.userAgent || navigator.vendor;
      let twitterUrl = auth_url;

      if (/android/i.test(userAgent)) {
        // Try to open in Chrome Custom Tab or fallback to default
        const chromeIntentUrl = `intent://${auth_url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        const newWindow = window.open(chromeIntentUrl, '_blank');
        if (newWindow) {
          newWindow.focus();
        } else {
          window.location.href = twitterUrl;
        }
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)) {
        twitterUrl = `twitter://${auth_url.replace(/^https?:\/\//, '')}`;
        window.location.href = twitterUrl;
      } else {
        const newWindow = window.open(twitterUrl, '_blank');
        if (newWindow) {
          newWindow.focus();
        } else {
          window.location.href = twitterUrl;
        }
      }

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to initiate Twitter verification');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-dark flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <h2 className="text-xl mb-4">Twitter Verification</h2>
        {error && <p className="text-red-500">{error}</p>}
        {isVerified ? (
          <>
            <p>Your Twitter account is already verified!</p>
            <p>Twitter Name: {screenName}</p>
            <button className="mt-4 p-2 bg-gray-500 text-white rounded" onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <p>Please verify your account by connecting to Twitter.</p>
            <button 
              className="mt-4 p-2 bg-blue-500 text-white rounded" 
              onClick={handleTwitterVerification}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify with Twitter'}
            </button>
            <button className="mt-4 p-2 bg-gray-500 text-white rounded" onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TwitterVerificationModal;