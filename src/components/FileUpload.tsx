import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { b2Storage } from '../services/b2StorageService';

interface FileUploadProps {
  studentId: string;
  uploadType: 'photo' | 'document';
  documentType?: string; // For documents: 'aadhar', 'marksheet', etc.
  currentFileUrl?: string;
  onUploadComplete: (fileUrl: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({
  studentId,
  uploadType,
  documentType,
  currentFileUrl,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (uploadType === 'photo') {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }
    } else {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Document size must be less than 10MB');
        return;
      }
    }

    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      let result;

      if (uploadType === 'photo') {
        result = await b2Storage.uploadStudentPhoto(
          studentId,
          selectedFile,
          (progress) => setUploadProgress(progress)
        );
      } else {
        result = await b2Storage.uploadStudentDocument(
          studentId,
          selectedFile,
          documentType || 'document',
          (progress) => setUploadProgress(progress)
        );
      }

      if (result.success && result.fileUrl && result.fileName) {
        setUploadSuccess(true);
        setUploadProgress(100);
        onUploadComplete(result.fileUrl, result.fileName);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setUploadSuccess(false);
          setSelectedFile(null);
        }, 2000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file');
      if (onUploadError) {
        onUploadError(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(currentFileUrl || null);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={uploadType === 'photo' ? 'image/*' : '.pdf,.doc,.docx,.jpg,.jpeg,.png'}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!selectedFile && !preview ? (
          <div className="space-y-2">
            {uploadType === 'photo' ? (
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            ) : (
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div>
              <button
                type="button"
                onClick={handleClick}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to upload
              </button>
              <p className="text-sm text-gray-500 mt-1">
                {uploadType === 'photo'
                  ? 'PNG, JPG up to 5MB'
                  : 'PDF, DOC, JPG up to 10MB'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            {preview && uploadType === 'photo' ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
                {!uploading && !uploadSuccess && (
                  <button
                    onClick={handleRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-gray-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {b2Storage.formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {!uploading && !uploadSuccess && (
                  <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : null}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Upload successful!</span>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}

            {/* Upload Button */}
            {selectedFile && !uploading && !uploadSuccess && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {uploadType === 'photo' ? 'Photo' : 'Document'}
              </button>
            )}

            {/* Change File Button */}
            {!uploading && !uploadSuccess && selectedFile && (
              <button
                onClick={handleClick}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change file
              </button>
            )}
          </div>
        )}
      </div>

      {/* Configuration Warning */}
      {!b2Storage.isConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Backblaze B2 not configured</p>
              <p className="mt-1">
                File upload will not work until you configure Backblaze B2 credentials in your environment variables.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
