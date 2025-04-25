import React from 'react';
import { User } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  selected?: boolean;
  onClick?: () => void;
  showVotes?: boolean;
  isWinner?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  selected = false, 
  onClick, 
  showVotes = false,
  isWinner = false
}) => {
  return (
    <div 
      className={`
        card transition-all duration-200 hover:shadow-md cursor-pointer
        ${selected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
        ${isWinner ? 'ring-2 ring-green-500 bg-green-50' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          <User className="h-8 w-8" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium">{candidate.name}</h3>
          {candidate.position && (
            <p className="text-sm text-gray-600">{candidate.position}</p>
          )}
        </div>
        {isWinner && (
          <div className="ml-auto">
            <span className="badge-success">Winner</span>
          </div>
        )}
      </div>

      {showVotes && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${candidate.votePercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-sm text-gray-600">{candidate.votes} votes</span>
            <span className="text-sm font-medium">{candidate.votePercentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;