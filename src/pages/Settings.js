import React, { useEffect, useState, useContext } from 'react';
import { 
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress
} from '@mui/material';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from 'axios';
import { LoginContext } from '../context/Context';

const UserProfile = () => {
  const [selectedAccount, setSelectedAccount] = useState(sessionStorage.getItem("accountId"));
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 const email = sessionStorage.getItem("email");
  const fetchAccountInfo = async (accountIdToFetch) => {
    setLoading(true);
    const token = sessionStorage.getItem("jwtToken");

    if (!token || !accountIdToFetch) {
      setError("No authentication or account selected");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.snptaxes.com/api/accounts/${accountIdToFetch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccountInfo(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch account information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountInfo(selectedAccount);
    }
  }, [selectedAccount]);

  const handleUploadSuccess = (newImageUrl) => {
    setAccountInfo((prev) => ({
      ...prev,
      profilePicture: newImageUrl
    }));
    fetchAccountInfo(selectedAccount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!accountInfo) return null;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Account Profile
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center'
          }}>
            <Box sx={{ flex: 1 }}>
              <ProfilePictureUpload 
                accountId={selectedAccount}
                currentImage={accountInfo.profilePicture}
                onUploadSuccess={handleUploadSuccess}
              />
            </Box>

            <Box sx={{ flex: 2 }}>
              <Typography variant="h6" gutterBottom color='primary.main'>
                {accountInfo.accountName || "No Name"}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Email:</strong> {email || "N/A"}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Client Type:</strong> {accountInfo.clientType || "N/A"}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Member Since:</strong> {formatDate(accountInfo.createdAt)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
