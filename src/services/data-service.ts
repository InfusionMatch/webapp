import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Generate the data client
const client = generateClient<Schema>();

export const dataService = {
  // ============================================================================
  // NURSE PROFILE
  // ============================================================================
  
  async createNurseProfile(data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) {
    try {
      const result = await client.models.NurseProfile.create({
        ...data,
        rating: 0,
        totalVisits: 0,
        completedVisits: 0,
        monthlyEarnings: 0,
        lifetimeEarnings: 0,
        onboardingComplete: false,
        onboardingStep: 0,
        isAvailable: true,
        accountStatus: 'active'
      });
      
      return result.data;
    } catch (error) {
      console.error('Error creating nurse profile:', error);
      throw error;
    }
  },

  async getNurseProfile(userId: string) {
    try {
      const result = await client.models.NurseProfile.list({
        filter: { userId: { eq: userId } }
      });
      
      return result.data?.[0] || null;
    } catch (error) {
      console.error('Error getting nurse profile:', error);
      throw error;
    }
  },

  async updateNurseProfile(id: string, updates: any) {
    try {
      const result = await client.models.NurseProfile.update({
        id,
        ...updates
      });
      
      return result.data;
    } catch (error) {
      console.error('Error updating nurse profile:', error);
      throw error;
    }
  },

  // ============================================================================
  // VISITS
  // ============================================================================
  
  async listAvailableVisits() {
    try {
      const result = await client.models.Visit.list({
        filter: { status: { eq: 'posted' } }
      });
      
      return result.data || [];
    } catch (error) {
      console.error('Error listing visits:', error);
      throw error;
    }
  },

  async getVisit(id: string) {
    try {
      const result = await client.models.Visit.get({ id });
      return result.data;
    } catch (error) {
      console.error('Error getting visit:', error);
      throw error;
    }
  },

  async listMyVisits(nurseId: string) {
    try {
      const result = await client.models.Visit.list({
        filter: { assignedNurseId: { eq: nurseId } }
      });
      
      return result.data || [];
    } catch (error) {
      console.error('Error listing my visits:', error);
      throw error;
    }
  },

  // ============================================================================
  // APPLICATIONS
  // ============================================================================
  
  async createApplication(data: {
    visitId: string;
    nurseId: string;
    coverLetter?: string;
    availabilityConfirmed: boolean;
  }) {
    try {
      const result = await client.models.Application.create({
        ...data,
        status: 'pending'
      });
      
      return result.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  async listMyApplications(nurseId: string) {
    try {
      const result = await client.models.Application.list({
        filter: { nurseId: { eq: nurseId } }
      });
      
      return result.data || [];
    } catch (error) {
      console.error('Error listing applications:', error);
      throw error;
    }
  },

  // ============================================================================
  // CREDENTIALS
  // ============================================================================
  
  async createCredential(data: {
  nurseId: string;
  type: "rn_license" | "lpn_license" | "iv_certification" | "cpr_certification" | "bls_certification" | "acls_certification" | "pals_certification" | "oncology_certification" | "other";
  title: string;
  issuingOrganization?: string;
  credentialNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  documentUrl?: string;
}) {
  try {
    const result = await client.models.Credential.create({
      ...data,
      verificationStatus: 'pending'
    });
    
    return result.data;
  } catch (error) {
    console.error('Error creating credential:', error);
    throw error;
  }
},


  async listMyCredentials(nurseId: string) {
    try {
      const result = await client.models.Credential.list({
        filter: { nurseId: { eq: nurseId } }
      });
      
      return result.data || [];
    } catch (error) {
      console.error('Error listing credentials:', error);
      throw error;
    }
  },

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  
  async listMyNotifications(userId: string) {
    try {
      const result = await client.models.Notification.list({
        filter: { userId: { eq: userId } }
      });
      
      return result.data || [];
    } catch (error) {
      console.error('Error listing notifications:', error);
      throw error;
    }
  },

  async markNotificationAsRead(id: string) {
    try {
      const result = await client.models.Notification.update({
        id,
        isRead: true,
        readAt: new Date().toISOString()
      });
      
      return result.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // ============================================================================
  // MESSAGING
  // ============================================================================
  
  async listMyConversations(userId: string) {
    try {
      const result = await client.models.Conversation.list();
      
      // Filter conversations where user is a participant
      return result.data?.filter(conv => 
        conv.participantIds?.includes(userId)
      ) || [];
    } catch (error) {
      console.error('Error listing conversations:', error);
      throw error;
    }
  },

  async listMessagesInConversation(conversationId: string) {
    try {
      const result = await client.models.Message.list({
        filter: { conversationId: { eq: conversationId } }
      });
      
      return result.data || [];
    } catch (error) {
      console.error('Error listing messages:', error);
      throw error;
    }
  },

  async sendMessage(data: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderType: 'nurse' | 'admin';
    content: string;
    messageType?: 'text' | 'document' | 'system';
  }) {
    try {
      const result = await client.models.Message.create({
        ...data,
        messageType: data.messageType || 'text',
        readBy: [],
        attachments: [],
        attachmentNames: []
      });
      
      return result.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};