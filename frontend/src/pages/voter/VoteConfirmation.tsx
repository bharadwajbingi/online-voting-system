import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import Header from '../../components/Header';
import CandidateCard from '../../components/CandidateCard';
import { useToast } from '../../context/ToastContext';
import { getElectionById } from '../../utils/helpers';
import { Election, Candidate } from '../../types';

const VoteConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
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
        
        if (data.status !== 'active') {
          showToast('Error', 'This election is not currently active', 'error');
          navigate('/voter/dashboard');
          return;
        }
        
        setElection(data);
      } catch (error) {
        showToast('Error', 'Failed to load election details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElection();
  }, [id, navigate, showToast]);

  const handleSelectCandidate = (candidate: Candidate) => {
    if (hasVoted) return;
    setSelectedCandidate(candidate);
  };

  const handleSubmitVote = async () => {
    if (!selectedCandidate || hasVoted) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit vote
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasVoted(true);
      showToast('Success', 'Your vote has been successfully submitted', 'success');
    } catch (error) {
      showToast('Error', 'Failed to submit your vote. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Vote Confirmation" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Vote Confirmation" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {!hasVoted && (
          <button 
            onClick={() => navigate('/voter/dashboard')}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
        )}
        
        <div className="card max-w-3xl mx-auto">
          {hasVoted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-gray-900">Vote Submitted Successfully!</h1>
              <p className="mt-2 text-gray-600">
                Your vote for <span className="font-medium">{election?.name}</span> has been recorded.
              </p>
              
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => navigate(`/voter/voter-list/${id}`)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  View Voter List
                </button>
                
                <button
                  onClick={() => navigate('/voter/dashboard')}
                  className="btn-primary w-full sm:w-auto"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{election?.name}</h1>
              <p className="text-gray-600 mb-6">
                Please select a candidate to cast your vote
              </p>
              
              {election?.candidates && election.candidates.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {election.candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        selected={selectedCandidate?.id === candidate.id}
                        onClick={() => handleSelectCandidate(candidate)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-8 flex flex-col">
                    {!selectedCandidate ? (
                      <div className="flex items-center justify-center text-yellow-700 bg-yellow-50 p-4 rounded-lg">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span>Please select a candidate to continue</span>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Your Selection:</h3>
                        <p className="font-medium">{selectedCandidate.name}</p>
                        {selectedCandidate.position && (
                          <p className="text-sm text-gray-600">{selectedCandidate.position}</p>
                        )}
                      </div>
                    )}
                    
                    <button
                      onClick={handleSubmitVote}
                      disabled={!selectedCandidate || isSubmitting}
                      className={`
                        mt-4 btn flex justify-center items-center
                        ${selectedCandidate ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                      `}
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Submitting...
                        </span>
                      ) : (
                        'Cast Your Vote'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No candidates found for this election.</p>
                </div>
              )}
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-yellow-700">Important Note:</p>
                    <p>Once submitted, your vote cannot be changed. Please review your selection carefully before submitting.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default VoteConfirmation;