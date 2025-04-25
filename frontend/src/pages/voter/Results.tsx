import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, Trophy } from 'lucide-react';
import Header from '../../components/Header';
import CandidateCard from '../../components/CandidateCard';
import { useToast } from '../../context/ToastContext';
import { getElectionById } from '../../utils/helpers';
import { Election, Candidate } from '../../types';

const VoterResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    // Fetch election data
    const fetchElection = async () => {
      try {
        const data = getElectionById(id);
        if (!data) {
          showToast('Error', 'Election not found', 'error');
          navigate('/voter/dashboard');
          return;
        }
        
        if (data.status !== 'completed') {
          showToast('Error', 'Results are not available yet', 'error');
          navigate('/voter/dashboard');
          return;
        }
        
        setElection(data);
      } catch (error) {
        showToast('Error', 'Failed to load election results', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElection();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Election Results" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!election || !election.candidates) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Election Results" />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">No results available</p>
        </div>
      </div>
    );
  }

  // Find winner
  const winner = election.candidates.reduce((prev, current) => 
    (prev.votes || 0) > (current.votes || 0) ? prev : current
  );

  // Sort candidates by votes (descending)
  const sortedCandidates = [...election.candidates].sort((a, b) => 
    (b.votes || 0) - (a.votes || 0)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Election Results" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate('/voter/dashboard')}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="card max-w-3xl mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{election.name} - Results</h1>
          <p className="text-gray-600 mb-8">
            The election concluded on {new Date(election.date).toLocaleDateString()}
          </p>
          
          <div className="border-2 border-green-100 rounded-lg bg-green-50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-xl font-medium text-gray-900">Winner</h2>
                <p className="text-2xl font-bold text-green-700">{winner.name}</p>
                {winner.position && (
                  <p className="text-green-600">{winner.position}</p>
                )}
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-auto text-center">
                <div className="text-sm text-gray-600">Total Votes</div>
                <div className="text-3xl font-bold text-green-700">{winner.votes}</div>
                <div className="text-sm font-medium text-green-600">{winner.votePercentage}%</div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Candidates</h3>
          
          <div className="space-y-4">
            {sortedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                showVotes={true}
                isWinner={candidate.id === winner.id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoterResults;