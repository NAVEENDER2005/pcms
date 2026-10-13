// components/UploadResume.tsx
import React, { useState, ChangeEvent, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

interface UploadResumeProps {
  onUploadSuccess?: () => void;
}

const UploadResume: React.FC<UploadResumeProps> = ({ onUploadSuccess }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeFile(file || null);
    setUploadStatus('');
    setStatusType('');
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setUploadStatus('Please select a file to upload.');
      setStatusType('error');
      return;
    }

    if (!user?.email) {
      setUploadStatus('User not logged in. Please sign in again.');
      setStatusType('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('');
    setStatusType('');

    const formData = new FormData();
    // Provide both 'file' and 'resume' for maximum backend compatibility
    formData.append('file', resumeFile);
    formData.append('resume', resumeFile);
    formData.append('consultant_email', user.email);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const skillsCount = result.analysis?.skills?.length;
        setUploadStatus(
          skillsCount !== undefined
            ? `Resume uploaded and analyzed successfully! Identified ${skillsCount} skills.`
            : 'Resume uploaded and analyzed successfully!'
        );
        setStatusType('success');
        setResumeFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Call the success callback to refresh parent data
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        let errorMsg = 'Upload failed';
        try {
          const errData = await response.json();
          if (typeof errData.detail === 'string') {
            errorMsg = errData.detail;
          } else if (errData.message) {
            errorMsg = errData.message;
          } else {
            errorMsg = JSON.stringify(errData);
          }
        } catch {
          errorMsg = await response.text();
        }
        setUploadStatus(`Failed to upload resume: ${errorMsg}`);
        setStatusType('error');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setUploadStatus('A network error occurred while uploading. Please check connection and try again.');
      setStatusType('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mt-6 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UploadCloud className="h-5 w-5 text-primary" aria-hidden="true" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume">Select Resume File (PDF, DOCX, or TXT)</Label>
          <Input
            ref={fileInputRef}
            id="resume"
            type="file"
            accept=".pdf,.txt,.docx,.doc"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !resumeFile}
          className="active:scale-[0.98] transition-transform"
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {isUploading ? 'Uploading & Analyzing...' : 'Upload'}
        </Button>

        {uploadStatus && (
          <div
            className={`flex items-start gap-2 p-3 rounded-md text-sm border ${
              statusType === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
            role="status"
          >
            {statusType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span>{uploadStatus}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadResume;
