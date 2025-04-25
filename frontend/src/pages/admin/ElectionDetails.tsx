import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, CheckCircle, XCircle, BarChart3, ClipboardList } from 'lucide-react';
import Header from '../../components/Header';
import { useToast } from '../../context/ToastContext';
import { getElectionById, getVotersForElection } from '../../utils/helpers';
import { Election, Voter } from '../../types';

const ElectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    // Simulate API call
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Election Details" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Election Details" />
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Election Details" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{election.name}</h1>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(election.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{election.timeSlot}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              {election.status === 'upcoming' && (
                <span className="badge bg-yellow-100 text-yellow-800">Upcoming</span>
              )}
              {election.status === 'active' && (
                <span className="badge bg-green-100 text-green-800">Active</span>
              )}
              {election.status === 'completed' && (
                <span className="badge bg-blue-100 text-blue-800">Completed</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card bg-blue-50 border-blue-100">
            <div className="flex items-start">
              <Users className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Voters</h3>
                <p className="text-3xl font-bold text-blue-700">{totalVoters}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-green-50 border-green-100">
            <div className="flex items-start">
              <CheckCircle className="h-10 w-10 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Voted</h3>
                <p className="text-3xl font-bold text-green-700">{votedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-red-50 border-red-100">
            <div className="flex items-start">
              <XCircle className="h-10 w-10 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Not Voted</h3>
                <p className="text-3xl font-bold text-red-700">{notVotedCount}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Voting Progress</h2>
          
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-700">{votedPercentage}% voted</span>
            <span className="text-sm text-gray-700">{votedCount} of {totalVoters}</span>
          </div>
          
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${votedPercentage}%` }}
            ></div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link 
              to={`/admin/graph/${id}`}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <BarChart3 className="h-5 w-5 mr-1.5" />
              View Live Graph
            </Link>
            
            <Link 
              to={`/admin/voter-list/${id}`}
              className="btn-secondary flex-1 flex items-center justify-center"
            >
              <ClipboardList className="h-5 w-5 mr-1.5" />
              View Voter List
            </Link>
          </div>
        </div>
        
        {election.candidates && election.candidates.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Candidates</h2>
            
            <div className="divide-y divide-gray-200">
              {election.candidates.map((candidate) => (
                <div key={candidate.id} className="py-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{candidate.name}</h3>
                    {candidate.position && (
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                    )}
                  </div>
                  {election.status === 'completed' && candidate.votes !== undefined && (
                    <div className="ml-auto text-right">
                      <p className="text-lg font-medium">{candidate.votes} votes</p>
                      <p className="text-sm text-gray-600">{candidate.votePercentage}%</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {election.status === 'completed' && (
              <div className="mt-6">
                <Link 
                  to={`/admin/results/${id}`}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  View Final Results
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ElectionDetails;