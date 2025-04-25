import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Header from '../../components/Header';
import { useToast } from '../../context/ToastContext';
import { getElectionById, getVotersForElection } from '../../utils/helpers';
import { Election, Voter } from '../../types';

const ElectionGraph: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        // Fetch election data
        const electionData = getElectionById(id);
        
        if (!electionData) {
          showToast('Error', 'Election not found', 'error');
          navigate('/admin/dashboard');
          return;
        }
        
        setElection(electionData);
        
        // Fetch voters for this election
        const votersData = getVotersForElection(id);
        setVoters(votersData);
      } catch (error) {
        showToast('Error', 'Failed to load election details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate, showToast]);

  const handleRefresh = async () => {
    if (!id) return;
    
    setRefreshing(true);
    
    try {
      // Simulate API call to get fresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update data (in a real app, this would fetch new data from the server)
      const electionData = getElectionById(id);
      const votersData = getVotersForElection(id);
      
      if (electionData) {
        setElection(electionData);
        setVoters(votersData);
        showToast('Success', 'Data refreshed successfully', 'success');
      }
    } catch (error) {
      showToast('Error', 'Failed to refresh data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Election Graph" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Election Graph" />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Election not found</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalVoters = voters.length;
  const votedCount = voters.filter(voter => voter.hasVoted).length;
  const notVotedCount = totalVoters - votedCount;
  const votedPercentage = totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0;
  const notVotedPercentage = 100 - votedPercentage;

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Election Graph" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(`/admin/election/${id}`)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Election Details
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex items-center text-blue-600 hover:text-blue-800"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
        
        <div className="card mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{election.name}</h1>
          <p className="text-gray-600 mb-6">Live Voting Statistics</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Voting Progress</h2>
              
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-green-600 rounded-l-full relative"
                  style={{ width: `${votedPercentage}%` }}
                >
                  {votedPercentage > 5 && (
                    <span className="absolute inset-0 flex items-center justify-center text-white font-medium">
                      {votedPercentage}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-600 rounded-full mr-2"></div>
                  <span>Voted: {votedCount} ({votedPercentage}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-gray-300 rounded-full mr-2"></div>
                  <span>Not Voted: {notVotedCount} ({notVotedPercentage}%)</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Registered Voters</span>
                  <span className="text-sm font-medium">{totalVoters}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Votes Cast</span>
                  <span className="text-sm font-medium text-green-600">{votedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-red-600">Pending Votes</span>
                  <span className="text-sm font-medium text-red-600">{notVotedCount}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Voter Participation</h2>
              
              <div className="aspect-square max-w-[240px] mx-auto relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Voted segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#16A34A"
                    strokeWidth="20"
                    strokeDasharray={`${votedPercentage * 2.51} ${(100 - votedPercentage) * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />
                  
                  {/* Not voted segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#D1D5DB"
                    strokeWidth="20"
                    strokeDasharray={`${notVotedPercentage * 2.51} ${(100 - notVotedPercentage) * 2.51}`}
                    strokeDashoffset={-votedPercentage * 2.51}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="block text-3xl font-bold">{votedPercentage}%</span>
                  <span className="text-sm text-gray-600">Participation</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Voted ({votedPercentage}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm">Not Voted ({notVotedPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {election.candidates && election.candidates.length > 0 && election.status === 'completed' && (
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Final Results</h2>
            
            <div className="space-y-4">
              {election.candidates.map((candidate) => (
                <div key={candidate.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{candidate.name}</h3>
                        {candidate.position && (
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-medium">{candidate.votes}</span>
                      <span className="text-gray-600"> votes</span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${candidate.votePercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-right">
                    <span className="text-sm font-medium">{candidate.votePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ElectionGraph;