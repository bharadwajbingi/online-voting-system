import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Election } from '../types';
import { formatDate } from '../utils/helpers';

interface ElectionCardProps {
  election: Election;
  role: 'admin' | 'voter';
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, role }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="badge bg-yellow-100 text-yellow-800">Upcoming</span>;
      case 'active':
        return <span className="badge bg-green-100 text-green-800">Active</span>;
      case 'completed':
        return <span className="badge bg-blue-100 text-blue-800">Completed</span>;
      default:
        return null;
    }
  };

  const adminLink = `/admin/election/${election.id}`;
  
  const getVoterActionLink = () => {
    if (election.status === 'active') {
      return `/voter/face-verification/${election.id}`;
    } else if (election.status === 'completed') {
      return `/voter/results/${election.id}`;
    }
    return '';
  };

  const getVoterActionButton = () => {
    if (election.status === 'active') {
      return <span className="btn-primary inline-block">Vote Now</span>;
    } else if (election.status === 'completed') {
      return <span className="btn-secondary inline-block">View Results</span>;
    }
    return <span className="btn bg-gray-100 text-gray-400 cursor-not-allowed">Not Started</span>;
  };

  return (
    <div className="card transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{election.name}</h3>
        {getStatusBadge(election.status)}
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(election.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{election.timeSlot}</span>
        </div>
        {election.voterCount && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{election.voterCount} voters</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 flex flex-col sm:flex-row sm:justify-between gap-2">
        {role === 'admin' ? (
          <Link to={adminLink} className="btn-primary text-center">
            Manage Election
          </Link>
        ) : (
          <>
            {election.status !== 'upcoming' && (
              <Link to={getVoterActionLink()} className="text-center">
                {getVoterActionButton()}
              </Link>
            )}
            <Link to={`/voter/voter-list/${election.id}`} className="btn-secondary text-center">
              View Voter List
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ElectionCard;