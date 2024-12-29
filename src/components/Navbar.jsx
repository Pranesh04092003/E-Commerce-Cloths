import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      {user && (
        <div>
          <span>Welcome, {user.fullName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 