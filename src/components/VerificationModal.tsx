import React from 'react';

interface VerificationModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  isVerified: boolean;
  telegramCode: string;
  onTelegramCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  message,
  isOpen,
  onClose,
  isVerified,
  telegramCode,
  onTelegramCodeChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">
          {message.includes('verified') ? 'Success' : 'Warning'}
        </h2>
        <p>{message}</p>
        {!isVerified && (
          <>
            <p className="mt-2">
              For more details, visit this documentation <a href="https://doc.context-pilot.xyz/getting-started/use-pilot-kombat" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">link</a>.
            </p>
            <input
              type="text"
              value={telegramCode}
              onChange={onTelegramCodeChange}
              placeholder="Enter Telegram code"
              className="mt-2 p-2 border rounded w-full"
            />
            <button onClick={onSubmit} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
              Submit
            </button>
          </>
        )}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;