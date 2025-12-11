import { useApp } from '../contexts/AppContext';
import { Database, Key, Zap, Shield } from 'lucide-react';

export default function Settings() {
  const { currentUser, setCurrentUser } = useApp();

  const roles = ['admin', 'clerk', 'fee-collector', 'hostel-warden', 'exam-officer', 'registrar'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and integrations</p>
      </div>

      {/* Role Switcher (Demo) */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="text-primary" size={24} />
          <h3 className="text-lg font-semibold">Role Switcher (Demo)</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Switch between different roles to test role-based access
        </p>
        <div className="grid grid-cols-3 gap-3">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setCurrentUser({ ...currentUser, role: role as any })}
              className={`py-3 px-4 rounded-lg border-2 transition-all capitalize ${
                currentUser.role === role
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {role.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="text-primary" size={24} />
          <h3 className="text-lg font-semibold">Integrations</h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Google Sheets</div>
              <div className="text-sm text-gray-600">Sync student data with Google Sheets</div>
            </div>
            <button className="btn btn-primary btn-sm">Connect</button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Google Drive</div>
              <div className="text-sm text-gray-600">Store documents and receipts</div>
            </div>
            <button className="btn btn-primary btn-sm">Connect</button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">Payment Gateway</div>
              <div className="text-sm text-gray-600">Configure UPI/payment gateway</div>
            </div>
            <button className="btn btn-primary btn-sm">Configure</button>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="text-primary" size={24} />
          <h3 className="text-lg font-semibold">Backup & Data</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <div className="font-medium text-green-900">Last Backup</div>
              <div className="text-sm text-green-700">2025-10-02 02:00 UTC</div>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
              Successful
            </span>
          </div>
          <div className="flex space-x-3">
            <button className="btn btn-secondary">Schedule Backup</button>
            <button className="btn btn-primary">Backup Now</button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="text-primary" size={24} />
          <h3 className="text-lg font-semibold">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-600">Add an extra layer of security</div>
            </div>
            <button className="btn btn-secondary btn-sm">Enable</button>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <div className="font-medium">Audit Log</div>
              <div className="text-sm text-gray-600">View all system activities</div>
            </div>
            <button className="btn btn-secondary btn-sm">View Log</button>
          </div>
        </div>
      </div>
    </div>
  );
}
