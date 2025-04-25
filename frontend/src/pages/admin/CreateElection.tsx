import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Upload, Info, X, Plus } from 'lucide-react';
import Header from '../../components/Header';
import { useToast } from '../../context/ToastContext';

interface Candidate {
  id: number;
  name: string;
  position: string;
}

const CreateElection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    candidates: [{ id: 1, name: '', position: '' }] as Candidate[],
  });
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setFileSelected(false);
    setFileName('');
  };

  const handleCandidateChange = (id: number, field: 'name' | 'position', value: string) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.map(candidate => 
        candidate.id === id ? { ...candidate, [field]: value } : candidate
      )
    }));
  };

  const addCandidate = () => {
    const newId = formData.candidates.length > 0 
      ? Math.max(...formData.candidates.map(c => c.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { id: newId, name: '', position: '' }]
    }));
  };

  const removeCandidate = (id: number) => {
    if (formData.candidates.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.filter(candidate => candidate.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.date || !formData.startTime || !formData.endTime) {
      showToast('Error', 'Please fill in all required fields', 'error');
      return;
    }
    
    if (!fileSelected) {
      showToast('Error', 'Please upload a voter list CSV file', 'error');
      return;
    }
    
    const hasInvalidCandidate = formData.candidates.some(c => !c.name || !c.position);
    if (hasInvalidCandidate) {
      showToast('Error', 'Please fill in all candidate details', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Success', 'Election created successfully', 'success');
      navigate('/admin/dashboard');
    } catch (error) {
      showToast('Error', 'Failed to create election', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Create Election" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Election</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Election Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="input"
                placeholder="e.g., Student Council Election 2025"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group col-span-1">
                <label htmlFor="date" className="form-label">
                  <Calendar className="h-4 w-4 inline-block mr-1" />
                  Election Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group col-span-1">
                <label htmlFor="startTime" className="form-label">
                  <Clock className="h-4 w-4 inline-block mr-1" />
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  className="input"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group col-span-1">
                <label htmlFor="endTime" className="form-label">
                  <Clock className="h-4 w-4 inline-block mr-1" />
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  className="input"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label mb-3">Candidates</label>
              
              <div className="space-y-4">
                {formData.candidates.map((candidate, index) => (
                  <div key={candidate.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Candidate {index + 1}</h4>
                      {formData.candidates.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeCandidate(candidate.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Candidate name"
                          value={candidate.name}
                          onChange={(e) => handleCandidateChange(candidate.id, 'name', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Position</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., President, Secretary"
                          value={candidate.position}
                          onChange={(e) => handleCandidateChange(candidate.id, 'position', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addCandidate}
                  className="btn-secondary flex items-center justify-center w-full"
                >
                  <Plus className="h-5 w-5 mr-1.5" />
                  Add Another Candidate
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Upload Voter List</label>
              
              {!fileSelected ? (
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload a CSV file containing the list of eligible voters
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      File should include: Name, Email, and ID for each voter
                    </p>
                    <label className="btn-primary inline-block mt-3 cursor-pointer">
                      <input
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      Select CSV File
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Important Note</p>
                <p className="mt-1">
                  Voter accounts will be created automatically based on the CSV file. Depending on the size of your voter list, this may take some time. Voters will receive login credentials via email.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="btn-secondary mr-3"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn-primary flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Creating...
                  </span>
                ) : (
                  'Create Election'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateElection;