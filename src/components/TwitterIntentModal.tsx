// src/components/TwitterIntentModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface Intent {
  created_at: string;
  intent_id: string;
  intent_type: string;
  status: string;
}

interface TwitterIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  evmAddress?: string;
}

const TwitterIntentModal: React.FC<TwitterIntentModalProps> = ({ isOpen, onClose, evmAddress }) => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [intentStatus, setIntentStatus] = useState<{ [key: string]: string | boolean }>({});

  useEffect(() => {
    if (isOpen) {
      const fetchIntents = async () => {
        try {
          const response = await axios.get('https://main-500474063246.us-central1.run.app/get_intent?intent_status=active');
          setIntents(response.data.intents);
        } catch (error) {
          console.error('Failed to fetch intents:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchIntents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && evmAddress) {
      const fetchIntentStatus = async (intent: Intent) => {
        try {
          const { intent_id, intent_type } = intent;
          const intentKey = `${intent_id}-${intent_type}`; // Unique key including type
          const url = `https://main-500474063246.us-central1.run.app/is_intent_verified?evm_address=${evmAddress}&intent=${intent_type}&intent_id=${intent_id}`;
          const response = await axios.get(url);
          const { message, error } = response.data;

          if (message === 'Intent is verified') {
            setIntentStatus((prevStatus) => ({ ...prevStatus, [intentKey]: 'verified' }));
          } else if (message === 'Intent not yet verified, it usually takes an hour.') {
            setIntentStatus((prevStatus) => ({ ...prevStatus, [intentKey]: 'pending' }));
          } else if (error === 'Verify Twitter first!') {
            setIntentStatus((prevStatus) => ({ ...prevStatus, [intentKey]: 'verify' }));
          } else {
            setIntentStatus((prevStatus) => ({ ...prevStatus, [intentKey]: 'not_found' }));
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 404) {
              setIntentStatus((prevStatus) => ({ ...prevStatus, [`${intent.intent_id}-${intent.intent_type}`]: 'not_found' }));
            } else {
              console.error('There was a problem checking intent verification:', error.message);
              setIntentStatus((prevStatus) => ({ ...prevStatus, [`${intent.intent_id}-${intent.intent_type}`]: false }));
            }
          } else {
            console.error('Unexpected error:', error);
          }
        }
      };

      intents.forEach((intent) => fetchIntentStatus(intent));
    }
  }, [isOpen, evmAddress, intents]);

  const handleIntentAction = (intent: Intent) => {
    const intentKey = `${intent.intent_id}-${intent.intent_type}`;
    if (evmAddress && intentStatus[intentKey] === 'not_found') {
      const url = `https://main-500474063246.us-central1.run.app/verify_twitter_intent?evm_address=${evmAddress}&intent=${intent.intent_type}&intent_id=${intent.intent_id}`;

      axios
        .get(url)
        .then((response) => {
          console.log('Success:', response.data);
          let twitterUrl = '';
          if (intent.intent_type === 'like') {
            twitterUrl = `https://twitter.com/intent/like?tweet_id=${intent.intent_id}`;
          } else if (intent.intent_type === 'retweet') {
            twitterUrl = `https://twitter.com/intent/retweet?tweet_id=${intent.intent_id}`;
          } else if (intent.intent_type === 'tweet') {
            twitterUrl = `https://twitter.com/intent/tweet?in_reply_to=${intent.intent_id}`;
          }
          window.open(twitterUrl, '_blank');
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            console.error('There was a problem with the fetch operation:', error.message);
          } else {
            console.error('Unexpected error:', error);
          }
        });
    } else {
      console.error('EVM Address is not provided or intent is already verified');
    }
  };

  const getButtonText = (intent: Intent) => {
    const intentKey = `${intent.intent_id}-${intent.intent_type}`;
    if (loading) return 'Loading...';
    const status = intentStatus[intentKey];
    const actionText = intent.intent_type.charAt(0).toUpperCase() + intent.intent_type.slice(1);
    if (status === 'verified') return `${actionText} ${intent.intent_id} (Already Verified)`;
    if (status === 'pending') return `${actionText} ${intent.intent_id} (Verification Pending)`;
    if (status === 'verify') return `${actionText} ${intent.intent_id} (Verify Twitter)`;
    return `${actionText} ${intent.intent_id}`;
  };

  const isButtonDisabled = (status: string | boolean) => {
    return status !== 'not_found';
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Twitter Actions</h2>
        <p className="mb-4">
          Perform the actions below on Twitter for rewards! <a href="https://doc.context-pilot.xyz/getting-started/use-pilot-kombat/like-retweet-and-tweet-response" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Documentation</a>
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          intents.map((intent) => {
            const intentKey = `${intent.intent_id}-${intent.intent_type}`;
            return (
              <div key={intentKey} className="mb-4">
                <button
                  onClick={() => handleIntentAction(intent)}
                  disabled={isButtonDisabled(intentStatus[intentKey])}
                  className={`font-bold py-2 px-4 rounded ${
                    isButtonDisabled(intentStatus[intentKey]) ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
                  }`}
                >
                  {getButtonText(intent)}
                </button>
              </div>
            );
          })
        )}
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

export default TwitterIntentModal;