import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Header from '../../components/Header';
import { useToast } from '../../context/ToastContext';
import { getElectionById } from '../../utils/helpers';

const FaceVerification: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<any>(null);
  const [verificationState, setVerificationState] = useState<
    'initial' | 'scanning' | 'success' | 'failed'
  >('initial');
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        setIsLoading(false);
      }
    };
    
    fetchElection();
  }, [id, navigate, showToast]);

  const startCamera = async () => {
    try {
      // This is simulating camera access - in a real app, you would use:
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // if (videoRef.current) {
      //   videoRef.current.srcObject = stream;
      // }
      
      // For demo purposes, we'll just simulate the scanning process
      setVerificationState('scanning');
      
      // Start countdown
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Simulate random success (80% chance) or failure
            const success = Math.random() < 0.8;
            setVerificationState(success ? 'success' : 'failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      showToast('Error', 'Could not access camera', 'error');
    }
  };

  const retryVerification = () => {
    setVerificationState('initial');
  };

  const handleContinue = () => {
    navigate(`/voter/vote-confirmation/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Face Verification" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Face Verification" />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate('/voter/dashboard')}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="card max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
          <p className="text-gray-600 mb-6">
            For {election?.name}
          </p>
          
          <div className="flex flex-col items-center">
            <div 
              className={`
                relative w-full max-w-md aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden
                ${verificationState === 'scanning' ? 'animate-pulse' : ''}
                ${verificationState === 'success' ? 'ring-4 ring-green-500' : ''}
                ${verificationState === 'failed' ? 'ring-4 ring-red-500' : ''}
              `}
            >
              {/* This would be a real camera feed in a production app */}
              {verificationState === 'initial' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
                  <Camera className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">Camera feed will appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Press "Start Verification" to begin</p>
                </div>
              )}
              
              {verificationState === 'scanning' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
                  <div className="relative">
                    {/* Simulated face outline */}
                    <div className="h-40 w-40 rounded-full border-4 border-dashed border-blue-500 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <p className="text-3xl font-bold text-blue-600">{countdown}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-blue-600 font-medium">
                    Scanning... Please look into the camera
                  </p>
                </div>
              )}
              
              {verificationState === 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-green-600 font-medium">Verification Successful</p>
                  <p className="text-sm text-green-500 mt-2">Identity confirmed</p>
                </div>
              )}
              
              {verificationState === 'failed' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-red-600 font-medium">Verification Failed</p>
                  <p className="text-sm text-red-500 mt-2">Unable to confirm identity</p>
                </div>
              )}
              
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover hidden" 
                autoPlay 
                playsInline
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            
            <div className="mt-8 w-full">
              {verificationState === 'initial' && (
                <button
                  onClick={startCamera}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-1.5" />
                  Start Verification
                </button>
              )}
              
              {verificationState === 'scanning' && (
                <div className="flex items-center justify-center text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-2"></div>
                  Verifying your identity...
                </div>
              )}
              
              {verificationState === 'success' && (
                <button
                  onClick={handleContinue}
                  className="btn-success w-full"
                >
                  Continue to Voting
                </button>
              )}
              
              {verificationState === 'failed' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Verification failed. Please ensure proper lighting and that your face is clearly visible.
                  </p>
                  <button
                    onClick={retryVerification}
                    className="btn flex items-center justify-center w-full bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Retry Verification
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Ensure your face is clearly visible and well-lit</li>
              <li>Remove hats, glasses, or face coverings</li>
              <li>Look directly at the camera during the verification process</li>
              <li>Stay still until the verification is complete</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaceVerification;