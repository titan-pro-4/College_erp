/**
 * SMS Service - Send SMS notifications using MSG91
 * Popular SMS gateway in India for OTP, notifications, and alerts
 */

interface SMSConfig {
  authKey: string;
  senderId: string;
  route: string;
  enabled: boolean;
}

interface SendSMSParams {
  to: string | string[]; // Phone number(s) with country code
  message: string;
  templateId?: string; // For DLT templates (India requirement)
}

interface SendOTPParams {
  to: string;
  otp: string;
  templateId?: string;
}

interface SMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

class SMSService {
  private config: SMSConfig;
  private baseUrl = 'https://api.msg91.com/api';

  constructor() {
    this.config = {
      authKey: import.meta.env.VITE_SMS_AUTH_KEY || '',
      senderId: import.meta.env.VITE_SMS_SENDER_ID || 'COLEGE',
      route: import.meta.env.VITE_SMS_ROUTE || '4',
      enabled: import.meta.env.VITE_SMS_ENABLED === 'true',
    };
  }

  /**
   * Check if SMS service is configured and enabled
   */
  isConfigured(): boolean {
    return Boolean(
      this.config.authKey &&
      this.config.senderId &&
      this.config.enabled
    );
  }

  /**
   * Send SMS to single or multiple recipients
   */
  async sendSMS(params: SendSMSParams): Promise<SMSResponse> {
    try {
      // Check if service is enabled
      if (!this.config.enabled) {
        console.log('[SMS] Service disabled. Message:', params.message);
        return {
          success: true,
          message: 'SMS service is disabled. Message logged to console.',
        };
      }

      // Validate configuration
      if (!this.isConfigured()) {
        throw new Error('SMS service not properly configured');
      }

      // Format phone numbers
      const recipients = Array.isArray(params.to) ? params.to : [params.to];
      const mobiles = recipients.join(',');

      // Prepare request
      const requestData = {
        authkey: this.config.authKey,
        mobiles: mobiles,
        message: params.message,
        sender: this.config.senderId,
        route: this.config.route,
        DLT_TE_ID: params.templateId || '', // DLT Template ID (required in India)
      };

      // Send SMS via MSG91
      const response = await fetch(`${this.baseUrl}/sendhttp.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.type === 'success') {
        return {
          success: true,
          message: 'SMS sent successfully',
          messageId: data.message,
        };
      } else {
        throw new Error(data.message || 'Failed to send SMS');
      }
    } catch (error: any) {
      console.error('[SMS] Error sending SMS:', error);
      return {
        success: false,
        message: 'Failed to send SMS',
        error: error.message,
      };
    }
  }

  /**
   * Send OTP via SMS
   */
  async sendOTP(params: SendOTPParams): Promise<SMSResponse> {
    const message = `Your OTP is ${params.otp}. Valid for 10 minutes. Do not share with anyone. - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: params.to,
      message: message,
      templateId: params.templateId,
    });
  }

  /**
   * Send admission approval SMS
   */
  async sendAdmissionApproval(
    phone: string,
    studentName: string,
    studentId: string,
    course: string
  ): Promise<SMSResponse> {
    const message = `Dear ${studentName}, Congratulations! Your admission to ${course} is approved. Student ID: ${studentId}. Welcome to our college! - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: phone,
      message: message,
    });
  }

  /**
   * Send admission rejection SMS
   */
  async sendAdmissionRejection(
    phone: string,
    studentName: string,
    course: string
  ): Promise<SMSResponse> {
    const message = `Dear ${studentName}, We regret to inform you that your application for ${course} has not been approved. Thank you for your interest. - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: phone,
      message: message,
    });
  }

  /**
   * Send fee payment reminder
   */
  async sendFeeReminder(
    phone: string,
    studentName: string,
    amount: number,
    dueDate: string
  ): Promise<SMSResponse> {
    const message = `Dear ${studentName}, Your fee of Rs.${amount} is due on ${dueDate}. Please pay at the earliest to avoid late fees. - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: phone,
      message: message,
    });
  }

  /**
   * Send fee payment confirmation
   */
  async sendFeeConfirmation(
    phone: string,
    studentName: string,
    amount: number,
    receiptNo: string
  ): Promise<SMSResponse> {
    const message = `Dear ${studentName}, Your fee payment of Rs.${amount} has been received. Receipt No: ${receiptNo}. Thank you! - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: phone,
      message: message,
    });
  }

  /**
   * Send hostel allocation SMS
   */
  async sendHostelAllocation(
    phone: string,
    studentName: string,
    roomNumber: string
  ): Promise<SMSResponse> {
    const message = `Dear ${studentName}, You have been allocated Room No: ${roomNumber}. Please complete hostel formalities at the office. - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: phone,
      message: message,
    });
  }

  /**
   * Send exam schedule notification
   */
  async sendExamNotification(
    phone: string,
    studentName: string,
    subject: string,
    examDate: string,
    time: string
  ): Promise<SMSResponse> {
    const message = `Dear ${studentName}, Your ${subject} exam is scheduled on ${examDate} at ${time}. Please arrive 15 mins early. All the best! - ${this.config.senderId}`;
    
    return this.sendSMS({
      to: phone,
      message: message,
    });
  }

  /**
   * Send bulk SMS to multiple students
   */
  async sendBulkSMS(
    phoneNumbers: string[],
    message: string
  ): Promise<SMSResponse> {
    return this.sendSMS({
      to: phoneNumbers,
      message: message,
    });
  }

  /**
   * Send custom notification
   */
  async sendNotification(
    phone: string,
    message: string
  ): Promise<SMSResponse> {
    return this.sendSMS({
      to: phone,
      message: `${message} - ${this.config.senderId}`,
    });
  }
}

// Export singleton instance
export const smsService = new SMSService();

// Export types
export type { SendSMSParams, SendOTPParams, SMSResponse };
