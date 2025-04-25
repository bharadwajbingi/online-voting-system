import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  // Check if voter came from the login page
  useEffect(() => {
    const voterOTP = sessionStorage.getItem('voterOTP');
    const voterContact = sessionStorage.getItem('voterContact');
    
    if (!voterOTP || !voterContact) {
      navigate('/voter-login');
    }
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input if current one is filled
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      showToast('Error', 'Please enter a complete 6-digit OTP', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored OTP (in a real app, verification would happen on the server)
      const storedOTP = sessionStorage.getItem('voterOTP');
      const voterContact = sessionStorage.getItem('voterContact');
      
      if (otpValue === storedOTP) {
        // Mock successful login
        login({
          id: 'voter1',
          name: 'Voter User',
          email: voterContact || undefined,
          role: 'voter'
        });
        
        // Clean up session storage
        sessionStorage.removeItem('voterOTP');
        sessionStorage.removeItem('voterContact');
        sessionStorage.removeItem('voterContactType');
        
        showToast('Verification successful', 'You are now logged in', 'success');
        navigate('/voter/dashboard');
      } else {
        showToast('Verification failed', 'Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Error', 'An error occurred during verification', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = () => {
    // Generate a new OTP (in a real app, this would be done on the server)
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('voterOTP', newOTP);
    console.log(`New OTP generated: ${newOTP}`); // For demonstration only
    
    setTimer(60);
    showToast('OTP Resent', 'A new OTP has been sent', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <Vote className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-gray-600">
            Enter the 6-digit code sent to your {sessionStorage.getItem('voterContactType') || 'contact'}
          </p>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2 sm:space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Verifying...
                </span>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            {timer > 0 ? (
              <p className="text-gray-600">
                Resend OTP in <span className="font-medium">{timer}s</span>
              </p>
            ) : (
              <button 
                onClick={resendOTP}
                className="text-blue-600 hover:text-blue-800"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/voter-login')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;