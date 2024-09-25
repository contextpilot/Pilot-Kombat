import React, { useState } from 'react';
import axios from 'axios';

interface WithdrawProps {
  onClose: () => void;
  onWithdraw: (points: number) => void;
  evmAddress?: string;
  points: number;
}

const Withdraw: React.FC<WithdrawProps> = ({ onClose, onWithdraw, evmAddress, points }) => {
  const [withdrawPoints, setWithdrawPoints] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!evmAddress) {
      setStatus('Error: No EVM address provided.');
      return;
    }

    if (withdrawPoints > points) {
      setStatus('Error: Not enough points.');
      return;
    }

    setStatus('Processing...');

    try {
      const response = await axios.post('https://main-wjaxre4ena-uc.a.run.app/gairdrop', {
        to_address: evmAddress,
        kombat_points: withdrawPoints,
      });
      setTransactionHash(response.data.transaction_hash);
      setStatus('Success!');
      onWithdraw(withdrawPoints);
    } catch (error) {
      setStatus('Error: Could not process the withdrawal.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-96 text-gray-900">
        <h2 className="text-2xl font-bold mb-4">Withdraw Points</h2>
        <p className="text-lg mb-2">Available points: {points}</p>
        
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="withdraw-points" className="text-sm font-small text-gray-700">
            Points to Withdraw
          </label>
          <a
            href="https://doc.context-pilot.xyz/getting-started/use-pilot-kombat/points-withdraw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            Documentation
          </a>
        </div>
        
        <input
          id="withdraw-points"
          type="number"
          value={withdrawPoints}
          onChange={(e) => setWithdrawPoints(Number(e.target.value))}
          className="border p-2 w-full mb-4 text-black placeholder-gray-500" // Ensure input text is visible
          placeholder="Enter points to withdraw"
        />
        <button
          onClick={handleWithdraw}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Cancel
        </button>
        {status && <p className="mt-4 text-gray-900">{status}</p>} {/* Added text color */}
        {transactionHash && (
          <p className="mt-4 text-gray-900"> {/* Added text color */}
            Transaction: <a href={transactionHash} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Transaction</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Withdraw;