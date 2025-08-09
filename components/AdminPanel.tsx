
import React, { useState } from 'react';
import type { User, Rating, Ticket } from '../types';
import { VerifiedIcon, PremiumIcon, TicketIcon } from './icons';

interface AdminPanelProps {
  users: User[];
  ratings: Rating[];
  tickets: Ticket[];
  updateUser: (user: User) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => void;
}

const ADMIN_ID = 7264453091;

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 font-medium text-sm rounded-t-lg transition-colors ${isActive ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
    >
        {label}
    </button>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, ratings, tickets, updateUser, updateTicketStatus }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ratings' | 'tickets'>('users');

  const getUserName = (id: number) => users.find(u => u.id === id)?.name || `User #${id}`;
  const openTicketsCount = tickets.filter(t => t.status === 'open').length;

  return (
    <div className="p-4 sm:p-6 pb-24 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-4" aria-label="Tabs">
            <TabButton label="User Management" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <TabButton label="Ratings Log" isActive={activeTab === 'ratings'} onClick={() => setActiveTab('ratings')} />
            <TabButton
                label={`Support Tickets ${openTicketsCount > 0 ? `(${openTicketsCount})` : ''}`}
                isActive={activeTab === 'tickets'}
                onClick={() => setActiveTab('tickets')}
            />
        </nav>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.filter(u => u.id !== ADMIN_ID).map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full object-cover" src={user.photoUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name} (@{user.username})</div>
                              <div className="text-sm text-gray-400">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                                {user.isVerified && <span title="Verified"><VerifiedIcon className="w-5 h-5"/></span>}
                                {user.isPremium && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-yellow-900">Premium</span>}
                                {user.isBlocked && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-red-900">Blocked</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => updateUser({...user, isVerified: !user.isVerified})} className="text-indigo-400 hover:text-indigo-300 mr-4">
                            {user.isVerified ? 'Un-verify' : 'Verify'}
                          </button>
                          <button onClick={() => updateUser({...user, isBlocked: !user.isBlocked})} className="text-red-400 hover:text-red-300">
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ratings' && (
         <div>
          <h2 className="text-xl font-semibold mb-4">All Ratings ({ratings.length})</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rater</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rated</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {[...ratings].reverse().map((rating, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getUserName(rating.raterId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getUserName(rating.ratedId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {rating.isSuperLike ? 
                                <span className="text-yellow-400 font-bold">Super Like ✨</span> : 
                                <span className="font-bold">{rating.score}</span>
                            }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{rating.timestamp.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div>
            <h2 className="text-xl font-semibold mb-4">Support Tickets ({tickets.length})</h2>
            <div className="space-y-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.status === 'open' ? 'bg-green-500 text-green-900' : 'bg-gray-600 text-gray-200'}`}>
                                    {ticket.status.toUpperCase()}
                                </span>
                                <h3 className="text-lg font-bold mt-2">{ticket.subject}</h3>
                                <p className="text-sm text-gray-400">
                                    From: {ticket.userName} (ID: {ticket.userId}) on {ticket.timestamp.toLocaleDateString()}
                                </p>
                            </div>
                            {ticket.status === 'open' && (
                                <button
                                    onClick={() => updateTicketStatus(ticket.id, 'closed')}
                                    className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-md transition"
                                >
                                    Mark as Closed
                                </button>
                            )}
                        </div>
                        <p className="mt-3 pt-3 border-t border-gray-700 text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};