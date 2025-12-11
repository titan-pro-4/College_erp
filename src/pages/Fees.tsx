import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { DollarSign, Printer, Mail } from 'lucide-react';
import { Payment } from '../types';
import jsPDF from 'jspdf';

export default function Fees() {
  const { students, payments, addPayment } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('Cash');

  const generateReceipt = (payment: Payment) => {
    const student = students.find((s) => s.studentId === payment.studentId);
    if (!student) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('College ERP', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Fee Receipt', 105, 30, { align: 'center' });
    
    // Receipt details
    doc.setFontSize(10);
    doc.text(`Receipt No: ${payment.receiptNumber}`, 20, 50);
    doc.text(`Date: ${payment.date}`, 20, 60);
    doc.text(`Student ID: ${student.studentId}`, 20, 70);
    doc.text(`Name: ${student.firstName} ${student.lastName}`, 20, 80);
    doc.text(`Course: ${student.course}`, 20, 90);
    doc.text(`Payment Method: ${payment.method}`, 20, 100);
    
    doc.setFontSize(14);
    doc.text(`Amount Paid: ₹${payment.amount.toLocaleString()}`, 20, 120);
    
    doc.setFontSize(10);
    doc.text(`Collected By: ${payment.collectedBy}`, 20, 140);
    
    // Footer
    doc.setFontSize(8);
    doc.text('This is a computer-generated receipt', 105, 280, { align: 'center' });
    
    doc.save(`receipt-${payment.receiptNumber}.pdf`);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !amount) return;

    const payment: Payment = {
      id: `PAY-2025-${String(payments.length + 1).padStart(4, '0')}`,
      studentId: selectedStudent,
      amount: parseFloat(amount),
      method: paymentMethod,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `REC-2025-${String(payments.length + 1).padStart(5, '0')}`,
      collectedBy: 'fee-collector-1',
    };

    addPayment(payment);
    generateReceipt(payment);
    
    // Reset form
    setSelectedStudent('');
    setAmount('');
    setPaymentMethod('Cash');
  };

  const student = students.find((s) => s.studentId === selectedStudent);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fee Collection</h1>
          <p className="text-gray-600 mt-1">Process payments and issue receipts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* POS Counter */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Payment Counter</h3>
            
            <form onSubmit={handlePayment} className="space-y-4">
              {/* Student Lookup */}
              <div>
                <label className="label">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">-- Select a student --</option>
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.studentId} - {s.firstName} {s.lastName} (₹{s.feeBalance})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Details */}
              {student && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Course:</span>
                      <span className="ml-2 font-medium">{student.course}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{student.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Outstanding Balance:</span>
                      <span className="ml-2 font-bold text-red-600">
                        ₹{student.feeBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="label">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="label">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Cash', 'Card', 'UPI', 'Bank Transfer'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <DollarSign size={18} />
                  <span>Process Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Today's Collections</h3>
            <div className="space-y-3">
              {payments.slice(-5).reverse().map((payment) => {
                const student = students.find((s) => s.studentId === payment.studentId);
                return (
                  <div
                    key={payment.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium">
                        {student?.firstName} {student?.lastName}
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        ₹{payment.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {payment.method} • {payment.receiptNumber}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => generateReceipt(payment)}
                        className="text-xs text-primary hover:underline flex items-center space-x-1"
                      >
                        <Printer size={12} />
                        <span>Print</span>
                      </button>
                      <button className="text-xs text-primary hover:underline flex items-center space-x-1">
                        <Mail size={12} />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
