import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export const storageService = {
  /**
   * Upload a credential document
   */
  async uploadCredential(nurseId: string, file: File, credentialType: string) {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${credentialType}_${Date.now()}.${fileExtension}`;
      const key = `nurse-credentials/${nurseId}/${fileName}`;

      const result = await uploadData({
        path: key,
        data: file,
        options: {
          contentType: file.type
        }
      }).result;

      return { key: result.path, success: true };
    } catch (error) {
      console.error('Error uploading credential:', error);
      throw error;
    }
  },

  /**
   * Upload a visit document
   */
  async uploadVisitDocument(visitId: string, file: File) {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `visit_${visitId}_${Date.now()}.${fileExtension}`;
      const key = `visit-documents/${visitId}/${fileName}`;

      const result = await uploadData({
        path: key,
        data: file,
        options: {
          contentType: file.type
        }
      }).result;

      return { key: result.path, success: true };
    } catch (error) {
      console.error('Error uploading visit document:', error);
      throw error;
    }
  },

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(key: string) {
    try {
      const result = await getUrl({ path: key });
      return result.url.toString();
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },

  /**
   * Delete a file
   */
  async deleteFile(key: string) {
    try {
      await remove({ path: key });
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};