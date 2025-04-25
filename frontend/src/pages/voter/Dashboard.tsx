import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ElectionCard from '../../components/ElectionCard';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dummyElections } from '../../utils/helpers';
import { Election } from '../../types';

const VoterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch eligible elections for this voter
    const fetchElections = async () => {
      try {
        // In a real app, this would filter elections based on the voter's ID
        await new Promise(resolve => setTimeout(resolve, 800));
        setElections(dummyElections);
      } catch (error) {
        console.error('Error fetching elections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Voter Dashboard" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Voter Dashboard" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="mt-1 text-gray-600">View and participate in your eligible elections</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1">
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
              
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                  <User className="h-12 w-12" />
                </div>
                
                <h3 className="text-lg font-medium text-center">{user?.name}</h3>
                {user?.email && (
                  <p className="text-sm text-gray-600 text-center mt-1">{user.email}</p>
                )}
                
                <div className="w-full mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Voter ID</span>
                      <span className="text-sm font-medium">{user?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Elections</span>
                      <span className="text-sm font-medium">{elections.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Elections</h2>
            
            {elections.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {elections.map((election) => (
                  <ElectionCard 
                    key={election.id} 
                    election={election} 
                    role="voter"
                  />
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-8">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Elections Found</h3>
                <p className="mt-1 text-gray-600 text-center">
                  You are not eligible to vote in any current elections.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoterDashboard;