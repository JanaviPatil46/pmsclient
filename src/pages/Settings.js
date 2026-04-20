import React, { useEffect, useState, useContext } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from 'axios';
import { LoginContext } from '../context/Context';
import { Loader2, User } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md mt-8 rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!accountInfo) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/40">
          <User size={18} className="text-primary shrink-0" />
          <h1 className="text-lg font-semibold text-foreground">Account Profile</h1>
        </div>

        {/* Card body */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar column */}
            <div className="shrink-0">
              <ProfilePictureUpload
                accountId={selectedAccount}
                currentImage={accountInfo.profilePicture}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>

            {/* Info column */}
            <div className="flex-1 space-y-3 w-full">
              <h2 className="text-xl font-bold text-primary">
                {accountInfo.accountName || 'No Name'}
              </h2>
              <hr className="border-border" />
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[110px]">Email</span>
                  <span className="text-muted-foreground">{email || 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[110px]">Client Type</span>
                  <span className="text-muted-foreground">{accountInfo.clientType || 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[110px]">Member Since</span>
                  <span className="text-muted-foreground">{formatDate(accountInfo.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
