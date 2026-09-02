import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLockScreen from './AdminLockScreen';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleUnlock = () => {
    localStorage.setItem('admin_unlocked', 'true');
    navigate('/portal');
  };

  return (
    <AdminLockScreen
      onUnlock={handleUnlock}
      onBack={() => navigate('/')}
    />
  );
};

export default Login;
