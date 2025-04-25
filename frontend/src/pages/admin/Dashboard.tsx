import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ChevronDown } from 'lucide-react';
import Header from '../../components/Header';
import ElectionCard from '../../components/ElectionCard';
import { Election } from '../../types';
import { dummyElections } from '../../utils/helpers';

const AdminDashboard: React.FC = () => {
  const [elections, setElections] = useState<Election[]>(dummyElections);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  
  const filteredElections = elections.filter(election => {
    if (filter === 'all') return true;
    return election.status === filter;
  });
  
  const countsMap = {
    all: elections.length,
    upcoming: elections.filter(e => e.status === 'upcoming').length,
    active: elections.filter(e => e.status === 'active').length,
    completed: elections.filter(e => e.status === 'completed').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Admin Dashboard" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to SecureVote</h1>
            <p className="mt-1 text-gray-600">Manage and oversee your elections</p>
          </div>
          
          <Link 
            to="/admin/create-election"
            className="btn-primary mt-4 sm:mt-0 flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-1.5" />
            Create New Election
          </Link>
        </div>
        
        <div className="mt-6 pb-2 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({countsMap.all})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 ${
                filter === 'upcoming'
                  ? 'bg-yellow-100 text-yellow-700 border-b-2 border-yellow-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({countsMap.upcoming})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 ${
                filter === 'active'
                  ? 'bg-green-100 text-green-700 border-b-2 border-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active ({countsMap.active})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                filter === 'completed'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed ({countsMap.completed})
            </button>
          </div>
        </div>
        
        {filteredElections.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredElections.map((election) => (
              <ElectionCard 
                key={election.id} 
                election={election} 
                role="admin"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No elections found</h3>
            <p className="mt-2 text-gray-600">
              {filter === 'all'
                ? "You haven't created any elections yet"
                : `You don't have any ${filter} elections`}
            </p>
            <Link 
              to="/admin/create-election"
              className="btn-primary mt-4 inline-flex items-center"
            >
              <PlusCircle className="h-5 w-5 mr-1.5" />
              Create New Election
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;