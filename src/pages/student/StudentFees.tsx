import { useState } from 'react';
import { DollarSign, CreditCard, Download, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { paymentService, RazorpayResponse } from '../../services/paymentService';

export default function StudentFees() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 'FEE-2025-001',
      date: '2025-08-15',
      amount: 50000,
      method: 'Razorpay',
      status: 'Paid',
      type: 'Tuition Fee - Semester 5',
      receiptNo: 'RCP-001',
      transactionId: 'pay_demo001',
    },
    {
      id: 'FEE-2025-002',
      date: '2025-09-10',
      amount: 20000,
      method: 'Razorpay',
      status: 'Paid',
      type: 'Lab & Development Fee',
      receiptNo: 'RCP-002',
      transactionId: 'pay_demo002',
    },
  ]);

  // Mock fee data
  const feeStructure = {
    tuitionFee: 75000,
    examFee: 5000,
    libraryFee: 2000,
    labFee: 8000,
    developmentFee: 10000,
    total: 100000,
    paid: 70000,
    pending: 30000,
  };

  const upcomingDueDates = [
    { type: 'Semester Fee', amount: 30000, dueDate: '2025-10-31', status: 'Pending' },
    { type: 'Hostel Fee', amount: 15000, dueDate: '2025-11-15', status: 'Upcoming' },
  ];

  // Download receipt
  const downloadReceipt = (payment: any) => {
    const doc = new jsPDF();
    
    // College Header with professional gradient effect
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 42, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('College ERP System', 105, 18, { align: 'center' });
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Fee Payment Receipt', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Accounts Department', 105, 37, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Receipt Info Box - Highlighted
    doc.setFillColor(254, 249, 195);
    doc.rect(20, 50, 170, 22, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(1);
    doc.rect(20, 50, 170, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Receipt No: ${payment.receiptNo}`, 25, 58);
    doc.text(`Payment ID: ${payment.id}`, 25, 66);
    doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`, 130, 58);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 130, 66);
    
    // Student Information Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Student Information', 20, 85);
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, 88, 190, 88);
    
    doc.setFillColor(240, 249, 255);
    doc.rect(20, 92, 170, 28, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(20, 92, 170, 28);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 25, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('John Doe', 60, 100);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Roll Number:', 25, 108);
    doc.setFont('helvetica', 'normal');
    doc.text('CS2023001', 60, 108);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Program:', 25, 116);
    doc.setFont('helvetica', 'normal');
    doc.text('B.Tech Computer Science', 60, 116);
    
    // Payment Details Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Payment Details', 20, 135);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 138, 190, 138);
    
    // Payment details table
    doc.setFillColor(250, 250, 250);
    doc.rect(20, 142, 170, 45, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.rect(20, 142, 170, 45);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', 25, 152);
    doc.setFont('helvetica', 'normal');
    doc.text(payment.type, 65, 152);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Mode:', 25, 162);
    doc.setFont('helvetica', 'normal');
    doc.text(payment.method || 'N/A', 65, 162);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Status:', 25, 172);
    doc.setFont('helvetica', 'normal');
    
    if (payment.status === 'Paid') {
      doc.setTextColor(34, 197, 94);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ ' + payment.status, 65, 172);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.text(payment.status, 65, 172);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Date:', 25, 182);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(payment.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), 65, 182);
    
    // Amount Paid - Large Box
    doc.setFillColor(37, 99, 235);
    doc.rect(20, 195, 170, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Amount Paid:', 25, 205);
    doc.setFontSize(16);
    doc.text(`₹${payment.amount.toLocaleString()}`, 155, 207, { align: 'right' });
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Payment confirmation note
    if (payment.status === 'Paid') {
      doc.setFillColor(220, 252, 231);
      doc.rect(20, 220, 170, 18, 'F');
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1);
      doc.rect(20, 220, 170, 18);
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(22, 163, 74);
      doc.text('✓ Payment Successfully Received', 105, 230, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }
    
    // Terms and Conditions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Terms & Conditions:', 20, 250);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('• This receipt is valid only if the payment status shows as "Paid"', 20, 257);
    doc.text('• Please preserve this receipt for future reference', 20, 262);
    doc.text('• For any discrepancies, contact the accounts department within 7 days', 20, 267);
    
    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 275, 190, 275);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated receipt and does not require a signature.', 105, 282, { align: 'center' });
    doc.text('For queries, contact: accounts@college.edu | Phone: +91-XXX-XXX-XXXX', 105, 287, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('College ERP System © 2025', 105, 293, { align: 'center' });
    
    // Save PDF
    doc.save(`Fee_Receipt_${payment.receiptNo}.pdf`);
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const paymentRequest = {
        amount: selectedAmount,
        currency: 'INR',
        orderId: `ORD-${Date.now()}`,
        customerName: 'John Doe',
        customerEmail: 'john.doe@student.college.edu',
        customerPhone: '9876543210',
        description: `Fee Payment - ₹${selectedAmount.toLocaleString()}`,
      };

      await paymentService.initiatePayment(
        paymentRequest,
        // Success callback
        (response: RazorpayResponse) => {
          console.log('Payment successful:', response);
          
          // Add to payment history
          const newPayment = {
            id: `FEE-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: selectedAmount,
            method: 'Razorpay',
            status: 'Paid',
            type: 'Fee Payment',
            receiptNo: `RCP-${Date.now().toString().slice(-6)}`,
            transactionId: response.razorpay_payment_id,
          };

          setPaymentHistory([newPayment, ...paymentHistory]);
          setPaymentProcessing(false);
          setShowPaymentModal(false);

          // Show success message
          alert(
            `✅ Payment Successful!\n\n` +
            `Amount: ₹${selectedAmount.toLocaleString()}\n` +
            `Transaction ID: ${response.razorpay_payment_id}\n\n` +
            `Receipt has been added to your payment history.`
          );
        },
        // Failure callback
        (error: string) => {
          console.error('Payment failed:', error);
          setPaymentError(error);
          setPaymentProcessing(false);
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Failed to initiate payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        <p className="text-gray-600 mt-1">View fee structure and payment history</p>
      </div>

      {/* Fee Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Fee</h3>
            <DollarSign className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{feeStructure.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Academic Year 2025-26</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Paid Amount</h3>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-600">₹{feeStructure.paid.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{((feeStructure.paid / feeStructure.total) * 100).toFixed(0)}% paid</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pending Amount</h3>
            <Clock className="text-orange-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-orange-600">₹{feeStructure.pending.toLocaleString()}</p>
          <button
            onClick={() => {
              setSelectedAmount(feeStructure.pending);
              setShowPaymentModal(true);
            }}
            className="mt-2 w-full px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={16} />
            Pay with Razorpay
          </button>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Fee Structure - Semester 5</h2>
        <div className="space-y-3">
          {[
            { name: 'Tuition Fee', amount: feeStructure.tuitionFee },
            { name: 'Examination Fee', amount: feeStructure.examFee },
            { name: 'Library Fee', amount: feeStructure.libraryFee },
            { name: 'Laboratory Fee', amount: feeStructure.labFee },
            { name: 'Development Fee', amount: feeStructure.developmentFee },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <span className="text-gray-800 font-semibold">₹{item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 bg-blue-50 px-4 rounded-lg">
            <span className="text-gray-800 font-bold text-lg">Total</span>
            <span className="text-blue-600 font-bold text-lg">₹{feeStructure.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Due Dates */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={24} className="text-orange-600" />
          Upcoming Due Dates
        </h2>
        <div className="space-y-3">
          {upcomingDueDates.map((due, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                due.status === 'Pending' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div>
                <h3 className="font-semibold text-gray-800">{due.type}</h3>
                <p className="text-sm text-gray-600">Due Date: {new Date(due.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">₹{due.amount.toLocaleString()}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    due.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {due.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Method</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{payment.receiptNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{payment.type}</td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 justify-center ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {payment.status === 'Paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {payment.status === 'Paid' ? (
                      <button 
                        onClick={() => downloadReceipt(payment)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mx-auto"
                      >
                        <Download size={16} />
                        Receipt
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAmount(payment.amount);
                          setShowPaymentModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-scale-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Confirm Payment</h2>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentProcessing(false);
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={paymentProcessing}
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Amount Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Amount to Pay</p>
                <p className="text-4xl font-bold text-blue-600">₹{selectedAmount.toLocaleString()}</p>
              </div>

              {/* Payment Gateway Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-blue-600" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">Razorpay Payment Gateway</p>
                    <p className="text-sm text-gray-600">Secure payment via UPI, Cards, NetBanking & more</p>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-semibold text-gray-800">What happens next:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Razorpay payment window will open</li>
                  <li>Choose your preferred payment method</li>
                  <li>Complete the payment securely</li>
                  <li>Receipt will be generated automatically</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentProcessing(false);
                  }}
                  disabled={paymentProcessing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRazorpayPayment}
                  disabled={paymentProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {paymentProcessing ? (
                    <>
                      <Clock size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
