// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'material-react-toastify';

// const AutoLogoutHandler = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('jwtToken');
//       const loginTime = localStorage.getItem('loginTime');
      
//       if (!token || !loginTime) {
//         return;
//       }

//       const currentTime = new Date().getTime();
//       const loginTimestamp = parseInt(loginTime);
//       const elapsedTime = currentTime - loginTimestamp;
//       const twoHours = 2 * 60 * 60 * 1000;

//       if (elapsedTime >= twoHours) {
//         // Clear all storage
//         sessionStorage.clear();
//         localStorage.clear();
        
//         toast.info('Your session has expired. Please login again.');
//         navigate('/client/login');
//       }
//     };

//     // Check on component mount
//     checkAuth();

//     // Set up interval to check every minute
//     const interval = setInterval(checkAuth, 60000);

//     return () => clearInterval(interval);
//   }, [navigate]);

//   return null;
// };

// export default AutoLogoutHandler;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'material-react-toastify';

const AutoLogoutHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwtToken');
      const loginTime = localStorage.getItem('loginTime');

      if (!token || !loginTime) {
        return;
      }

      const currentTime = Date.now();
      const loginTimestamp = parseInt(loginTime, 10);
      const elapsedTime = currentTime - loginTimestamp;

      // 🔥 SET AUTO LOGOUT TIME = 4 MINUTES
      const fourMinutes = 4 * 60 * 1000; // 240,000 ms

      if (elapsedTime >= fourMinutes) {
        sessionStorage.clear();
        localStorage.clear();

        toast.info('Your session expired. Please login again.');
        navigate('/client/login');
      }
    };

    // Run once on mount
    checkAuth();

    // Run every 10 seconds (faster check)
    const interval = setInterval(checkAuth, 10000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default AutoLogoutHandler;
