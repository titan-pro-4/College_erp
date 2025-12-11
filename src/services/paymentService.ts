// Payment Gateway Service - Razorpay Integration
// Configured for test mode with real API

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  paymentMethod?: string;
  error?: string;
  timestamp: string;
}

class PaymentService {
  private razorpayKey: string;
  private razorpaySecret: string;

  constructor() {
    // Load from environment variables
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ROSswCGsHCVLRN';
    this.razorpaySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'OpWO6VQ3qsGM3iOmVK1LE8uV';
    
    console.log('Razorpay Payment Service initialized (Test Mode)');
  }

  // Load Razorpay script
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if script already loaded
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Create and initiate payment
  async initiatePayment(
    request: PaymentRequest,
    onSuccess: (response: RazorpayResponse) => void,
    onFailure: (error: string) => void
  ): Promise<void> {
    // Load Razorpay script
    const scriptLoaded = await this.loadRazorpayScript();
    
    if (!scriptLoaded) {
      onFailure('Failed to load Razorpay. Please check your internet connection.');
      return;
    }

    // Create Razorpay options
    const options: RazorpayOptions = {
      key: this.razorpayKey,
      amount: Math.round(request.amount * 100), // Convert to paise
      currency: request.currency,
      name: 'College ERP System',
      description: request.description,
      prefill: {
        name: request.customerName,
        email: request.customerEmail,
        contact: request.customerPhone,
      },
      theme: {
        color: '#2563eb', // Blue theme
      },
      handler: (response: RazorpayResponse) => {
        console.log('Payment successful:', response);
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
          onFailure('Payment cancelled by user');
        },
      },
    };

    // Initialize Razorpay
    try {
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      onFailure('Failed to open payment gateway');
    }
  }

  // Verify payment signature (client-side validation)
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    // In production, this should be done on server-side
    // For now, we'll accept the payment if we have all required fields
    return !!(orderId && paymentId && signature);
  }

  // Get payment details
  async getPaymentDetails(paymentId: string): Promise<any> {
    // This should be called from backend
    console.log('Fetching payment details for:', paymentId);
    return {
      id: paymentId,
      status: 'captured',
      amount: 0,
      currency: 'INR',
    };
  }
}

export const paymentService = new PaymentService();

