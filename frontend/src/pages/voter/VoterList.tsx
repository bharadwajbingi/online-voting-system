import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Check, X } from 'lucide-react';
import Header from '../../components/Header';
import { useToast } from '../../context/ToastContext';
import { getElectionById, getVotersForElection } from '../../utils/helpers';
import { Election, Voter } from '../../types';

const VoterList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filteredVoters, setFilteredVoters] = useState<Voter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'voted' | 'not-voted'>('all');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    // Fetch election data
    const fetchData = async () => {
      try {
        const electionData = getElectionById(id);
        
        if (!electionData) {
          showToast('Error', 'Election not found', 'error');
          navigate('/voter/dashboard');
          return;
        }
        
        setElection(electionData);
        
        // Fetch voters for this election
        const votersData = getVotersForElection(id);
        setVoters(votersData);
        setFilteredVoters(votersData);
      } catch (error) {
        showToast('Error', 'Failed to load voter list', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate, showToast]);

  useEffect(() => {
    // Apply filters and search
    let result = [...voters];
    
    // Apply status filter
    if (filterBy === 'voted') {
      result = result.filter(voter => voter.hasVoted);
    } else if (filterBy === 'not-voted') {
      result = result.filter(voter => !voter.hasVoted);
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(voter => 
        voter.name.toLowerCase().includes(term) || 
        (voter.email && voter.email.toLowerCase().includes(term))
      );
    }
    
    setFilteredVoters(result);
  }, [voters, filterBy, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Voter List" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Voter List" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{election?.name}</h1>
              <p className="text-gray-600">Voter List</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="badge-success">{voters.filter(v => v.hasVoted).length} Voted</div>
              <div className="badge-danger">{voters.filter(v => !v.hasVoted).length} Not Voted</div>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search voters..."
                className="pl-10 input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterBy('all')}
                className={`btn ${filterBy === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterBy('voted')}
                className={`btn ${filterBy === 'voted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Voted
              </button>
              <button
                onClick={() => setFilterBy('not-voted')}
                className={`btn ${filterBy === 'not-voted' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Not Voted
              </button>
            </div>
          </div>
          
          <div className="table-container">
            {filteredVoters.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredVoters.map((voter) => (
                    <tr key={voter.id}>
                      <td className="font-medium">{voter.name}</td>
                      <td>{voter.email}</td>
                      <td>
                        {voter.hasVoted ? (
                          <span className="inline-flex items-center text-green-700">
                            <Check className="h-5 w-5 mr-1" />
                            Voted
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-700">
                            <X className="h-5 w-5 mr-1" />
                            Not Voted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-gray-500">
                {searchTerm ? 'No voters match your search' : 'No voters found'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoterList;