import { useApp } from '../contexts/AppContext';
import { Home as HomeIcon, Users } from 'lucide-react';

export default function Hostel() {
  const { hostelRooms } = useApp();

  const buildings = Array.from(new Set(hostelRooms.map((r) => r.building)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'Occupied':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'Full':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'Maintenance':
        return 'bg-gray-100 border-gray-400 text-gray-700';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hostel Management</h1>
          <p className="text-gray-600 mt-1">Manage room allocation and occupancy</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Users size={18} />
          <span>Allocate Room</span>
        </button>
      </div>

      {/* Occupancy Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-600">Total Rooms</div>
          <div className="text-2xl font-bold mt-1">{hostelRooms.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Available</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {hostelRooms.filter((r) => r.status === 'Available').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Occupied</div>
          <div className="text-2xl font-bold mt-1 text-yellow-600">
            {hostelRooms.filter((r) => r.status === 'Occupied').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Full</div>
          <div className="text-2xl font-bold mt-1 text-red-600">
            {hostelRooms.filter((r) => r.status === 'Full').length}
          </div>
        </div>
      </div>

      {/* Buildings */}
      {buildings.map((building) => (
        <div key={building} className="card">
          <h3 className="text-lg font-semibold mb-4">Building {building}</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {hostelRooms
              .filter((r) => r.building === building)
              .map((room) => (
                <div
                  key={room.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getStatusColor(
                    room.status
                  )}`}
                  title={`Room ${room.roomNumber} - ${room.status}`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <HomeIcon size={20} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{room.roomNumber}</div>
                    <div className="text-xs mt-1">
                      {room.occupants.length}/{room.capacity}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
