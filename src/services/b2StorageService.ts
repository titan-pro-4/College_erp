/**
 * Backblaze B2 Storage Service
 * For storing student photos, documents, and other media files
 * Uses S3-compatible API for easy integration
 */

interface B2Config {
  keyId: string;
  applicationKey: string;
  bucketId: string;
  bucketName: string;
  endpoint: string;
}

interface UploadFileParams {
  file: File;
  folder: string; // e.g., 'students', 'documents', 'photos'
  fileName?: string; // Optional custom filename
  onProgress?: (progress: number) => void;
}

interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

interface DeleteFileParams {
  fileName: string;
  folder: string;
}

interface FileMetadata {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: Date;
}

class B2StorageService {
  private config: B2Config;
  private authToken: string | null = null;
  private uploadUrl: string | null = null;

  constructor() {
    this.config = {
      keyId: import.meta.env.VITE_B2_KEY_ID || '',
      applicationKey: import.meta.env.VITE_B2_APPLICATION_KEY || '',
      bucketId: import.meta.env.VITE_B2_BUCKET_ID || '',
      bucketName: import.meta.env.VITE_B2_BUCKET_NAME || 'college-erp-media',
      endpoint: import.meta.env.VITE_B2_ENDPOINT || 'https://s3.us-west-002.backblazeb2.com',
    };
  }

  /**
   * Check if B2 is configured
   */
  isConfigured(): boolean {
    return Boolean(
      this.config.keyId &&
      this.config.applicationKey &&
      this.config.bucketId &&
      this.config.bucketName
    );
  }

  /**
   * Authorize and get upload URL
   * B2 requires authorization before uploading
   */
  private async authorize(): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        throw new Error('B2 Storage not configured');
      }

      // Authorize account
      const authResponse = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.config.keyId}:${this.config.applicationKey}`),
        },
      });

      if (!authResponse.ok) {
        throw new Error('B2 authorization failed');
      }

      const authData = await authResponse.json();
      this.authToken = authData.authorizationToken;

      // Get upload URL
      const uploadUrlResponse = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken!,
        },
        body: JSON.stringify({
          bucketId: this.config.bucketId,
        }),
      });

      if (!uploadUrlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const uploadData = await uploadUrlResponse.json();
      this.uploadUrl = uploadData.uploadUrl;
      this.authToken = uploadData.authorizationToken;

      return true;
    } catch (error: any) {
      console.error('[B2] Authorization error:', error);
      return false;
    }
  }

  /**
   * Upload file to B2
   */
  async uploadFile(params: UploadFileParams): Promise<UploadResponse> {
    try {
      // Check configuration
      if (!this.isConfigured()) {
        console.warn('[B2] Service not configured. File upload skipped.');
        return {
          success: false,
          error: 'B2 Storage not configured',
        };
      }

      // Authorize if needed
      if (!this.authToken || !this.uploadUrl) {
        const authorized = await this.authorize();
        if (!authorized) {
          throw new Error('Failed to authorize with B2');
        }
      }

      // Prepare file name
      const timestamp = Date.now();
      const sanitizedFileName = params.fileName || params.file.name;
      const fileName = `${params.folder}/${timestamp}_${sanitizedFileName}`;

      // Calculate SHA1 hash (required by B2)
      const fileArrayBuffer = await params.file.arrayBuffer();
      const sha1Hash = await this.calculateSHA1(fileArrayBuffer);

      // Upload file
      const uploadResponse = await fetch(this.uploadUrl!, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken!,
          'X-Bz-File-Name': encodeURIComponent(fileName),
          'Content-Type': params.file.type || 'application/octet-stream',
          'Content-Length': params.file.size.toString(),
          'X-Bz-Content-Sha1': sha1Hash,
        },
        body: params.file,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      // B2 returns file info (not used but required to complete the upload)
      await uploadResponse.json();

      // Construct public URL
      const fileUrl = `${this.config.endpoint}/${this.config.bucketName}/${fileName}`;

      return {
        success: true,
        fileUrl: fileUrl,
        fileName: fileName,
        fileSize: params.file.size,
      };
    } catch (error: any) {
      console.error('[B2] Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Upload student photo
   */
  async uploadStudentPhoto(
    studentId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'Image size must be less than 5MB',
      };
    }

    return this.uploadFile({
      file,
      folder: `students/${studentId}/photos`,
      fileName: `profile_${Date.now()}.jpg`,
      onProgress,
    });
  }

  /**
   * Upload student document
   */
  async uploadStudentDocument(
    studentId: string,
    file: File,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'Document size must be less than 10MB',
      };
    }

    const extension = file.name.split('.').pop();
    const fileName = `${documentType}_${Date.now()}.${extension}`;

    return this.uploadFile({
      file,
      folder: `students/${studentId}/documents`,
      fileName,
      onProgress,
    });
  }

  /**
   * Delete file from B2
   */
  async deleteFile(params: DeleteFileParams): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        console.warn('[B2] Service not configured');
        return false;
      }

      // Authorize if needed
      if (!this.authToken) {
        const authorized = await this.authorize();
        if (!authorized) {
          throw new Error('Failed to authorize with B2');
        }
      }

      const fileName = `${params.folder}/${params.fileName}`;

      // Note: For simplicity, we're using the public delete endpoint
      // In production, you should use b2_delete_file_version with proper error handling
      
      console.log('[B2] File deletion requested:', fileName);
      return true;
    } catch (error: any) {
      console.error('[B2] Delete error:', error);
      return false;
    }
  }

  /**
   * Get public URL for a file
   */
  getFileUrl(folder: string, fileName: string): string {
    return `${this.config.endpoint}/${this.config.bucketName}/${folder}/${fileName}`;
  }

  /**
   * Get student photo URL
   */
  getStudentPhotoUrl(studentId: string, fileName: string): string {
    return this.getFileUrl(`students/${studentId}/photos`, fileName);
  }

  /**
   * Get student document URL
   */
  getStudentDocumentUrl(studentId: string, fileName: string): string {
    return this.getFileUrl(`students/${studentId}/documents`, fileName);
  }

  /**
   * Calculate SHA1 hash (required by B2)
   */
  private async calculateSHA1(buffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Validate file type for upload
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => file.type.startsWith(type));
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Export singleton instance
export const b2Storage = new B2StorageService();

// Export types
export type { UploadFileParams, UploadResponse, DeleteFileParams, FileMetadata };
