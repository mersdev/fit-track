import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (!savedProfile) {
      navigate('/profile');
    }
  }, [navigate]);

  return <>{children}</>;
}
