import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Card, Button, Label, TextInput, Alert, Modal } from 'flowbite-react';
import { HiOutlineCog, HiOutlineLockClosed, HiInformationCircle, HiCheck, HiX, HiMail } from 'react-icons/hi';
import Sidebar from "./Components/SideBar Section/Sidebar";
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOut,
} from '../redux/user/userSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
  const [isResetting, setIsResetting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          newPassword: formData.newPassword
        }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setErrors(prev => ({
          ...prev,
          password: 'Current password is incorrect'
        }));
        dispatch(updateUserFailure(data));
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFormData({
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      dispatch(updateUserFailure(error));
      setErrors(prev => ({
        ...prev,
        submit: 'An error occurred. Please try again.'
      }));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setResetStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setResetStatus({
          type: 'success',
          message: 'Reset instructions have been sent to your email.'
        });
        setTimeout(() => {
          setShowForgotModal(false);
          setResetEmail('');
        }, 3000);
      } else {
        setResetStatus({
          type: 'error',
          message: data.message || 'Failed to send reset email.'
        });
      }
    } catch (error) {
      setResetStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="dashboard flex min-h-screen bg-gray-50">
      <div className="dashboardContainer flex flex-1">
        <Sidebar />
        <div className="mainContent flex-1 p-6">
          <Card className="mb-6 bg-gradient-to-r from-cyan-600 to-green-500">
            <div className="flex items-center gap-4">
              <HiOutlineCog className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Settings
                </h2>
                <p className="text-cyan-50">
                  Manage your account security
                </p>
              </div>
            </div>
          </Card>

          <Card className="w-3/4 mx-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-medium">Change Password</h3>
              </div>
              <Button
                color="light"
                size="sm"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </Button>
            </div>

            {updateSuccess && (
              <Alert color="success" icon={HiCheck} className="mb-4">
                Password updated successfully!
              </Alert>
            )}

            {errors.submit && (
              <Alert color="failure" icon={HiX} className="mb-4">
                {errors.submit}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" value="Current Password" />
                <TextInput
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  color={errors.password ? 'failure' : undefined}
                  helperText={errors.password}
                />
              </div>

              <div>
                <Label htmlFor="newPassword" value="New Password" />
                <TextInput
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  color={errors.newPassword ? 'failure' : undefined}
                  helperText={errors.newPassword}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" value="Confirm New Password" />
                <TextInput
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  color={errors.confirmPassword ? 'failure' : undefined}
                  helperText={errors.confirmPassword}
                />
              </div>

              <Alert color="info" icon={HiInformationCircle}>
                Password must be at least 8 characters long
              </Alert>

              <Button
                type="submit"
                gradientDuoTone=""
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="mr-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </Card>

          {/* Forgot Password Modal */}
         
          <Modal className= 'p-40 'show={showForgotModal} onClose={() => setShowForgotModal(false)}>
            <Modal.Header>
              Reset Password
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                
                {resetStatus.message && (
                  <Alert 
                    color={resetStatus.type === 'success' ? 'success' : 'failure'}
                    icon={resetStatus.type === 'success' ? HiCheck : HiX}
                  >
                    {resetStatus.message}
                  </Alert>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="resetEmail" value="Email Address" />
                    <TextInput
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      icon={HiMail}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      color="gray" 
                      onClick={() => setShowForgotModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isResetting}
                    >
                      {isResetting ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Settings;