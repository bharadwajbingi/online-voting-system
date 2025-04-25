import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { generateOTP } from '../../utils/helpers';

const VoterLogin: React.FC = () => {
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'email' | 'mobile'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact) {
      showToast('Error', `Please enter your ${contactType}`, 'error');
      return;
    }
    
    // Validate input
    if (contactType === 'email' && !/\S+@\S+\.\S+/.test(contact)) {
      showToast('Error', 'Please enter a valid email address', 'error');
      return;
    } else if (contactType === 'mobile' && !/^\d{10}$/.test(contact)) {
      showToast('Error', 'Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate OTP (in a real app, this would be done on the server)
      const otp = generateOTP();
      console.log(`OTP generated: ${otp}`); // For demonstration only
      
      // Store the OTP in sessionStorage (in a real app, this would be managed differently)
      sessionStorage.setItem('voterOTP', otp);
      sessionStorage.setItem('voterContact', contact);
      sessionStorage.setItem('voterContactType', contactType);
      
      showToast('OTP Sent', `A 6-digit OTP has been sent to your ${contactType}`, 'success');
      navigate('/verify-otp');
    } catch (error) {
      showToast('Error', 'Failed to send OTP. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleContactType = () => {
    setContact('');
    setContactType(contactType === 'email' ? 'mobile' : 'email');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <Vote className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Voter Login</h2>
          <p className="mt-2 text-gray-600">Enter your details to access your ballot</p>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <div className="flex justify-between mb-1">
                <label htmlFor="contact" className="form-label">
                  {contactType === 'email' ? 'Email Address' : 'Mobile Number'}
                </label>
                <button 
                  type="button" 
                  onClick={toggleContactType}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Use {contactType === 'email' ? 'mobile number' : 'email'} instead
                </button>
              </div>
              <input
                id="contact"
                type={contactType === 'email' ? 'email' : 'tel'}
                className="input"
                placeholder={contactType === 'email' ? 'your@email.com' : '10-digit number'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Are you an administrator?{' '}
            <Link to="/admin-login" className="text-blue-600 hover:text-blue-800 font-medium">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;