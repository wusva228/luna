import React, { useState } from 'react';
import type { User, Rating, Ticket, PremiumRequest, Report, AgeVerificationRequest, UnbanRequest } from '../types';
import { VerifiedIcon } from './icons';

interface AdminPanelProps {
  users: User[];
  ratings: Rating[];
  tickets: Ticket[];
  premiumRequests: PremiumRequest[];
  reports: Report[];
  ageVerificationRequests: AgeVerificationRequest[];
  unbanRequests: UnbanRequest[];
  updateUser: (user: Partial<User>) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => void;
  approvePremiumRequest: (userId: number) => void;
  replyToTicket: (ticketId: string, reply: string) => void;
  resolveReport: (reportId: string) => void;
  handleAgeVerificationRequest: (requestId: string, isApproved: boolean) => void;
  handleUnbanRequest: (requestId: string, isApproved: boolean) => void;
}

const ADMIN_ID = 7264453091;

type AdminTab = 'users' | 'ratings' | 'tickets' | 'premium' | 'reports' | 'age_verification' | 'unban_requests';

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void; count?: number}> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${isActive ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
    >
        {label} {count !== undefined && count > 0 && <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-500 text-white">{count}</span>}
    </button>
);

const TicketReplyForm: React.FC<{ ticketId: string, onReply: (ticketId: string, reply: string) => void }> = ({ ticketId, onReply }) => {
    const [reply, setReply] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        onReply(ticketId, reply);
        setReply('');
    };
    return (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input 
                type="text" 
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Напишите ответ..."
                className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-1 px-2 text-white"
            />
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm">Ответить</button>
        </form>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, ratings, tickets, premiumRequests, reports, ageVerificationRequests, unbanRequests, updateUser, updateTicketStatus, approvePremiumRequest, replyToTicket, resolveReport, handleAgeVerificationRequest, handleUnbanRequest }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const getUserName = (id: number) => users.find(u => u.id === id)?.name || `Пользователь #${id}`;

  const handleBlockUser = (user: User) => {
    if (user.isBlocked) {
        updateUser({ id: user.id, isBlocked: false, banReason: undefined });
    } else {
        const reason = prompt(`Укажите причину блокировки для пользователя ${user.name}:`);
        if (reason) {
            updateUser({ id: user.id, isBlocked: true, banReason: reason });
        } else {
            alert('Причина блокировки не может быть пустой.');
        }
    }
  };

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const pendingPremiumCount = premiumRequests.filter(r => r.status === 'pending').length;
  const openReportsCount = reports.filter(r => r.status === 'open').length;
  const pendingAgeVerificationCount = ageVerificationRequests.filter(r => r.status === 'pending').length;
  const pendingUnbanCount = unbanRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-4 sm:p-6 pb-24 text-white">
      <h1 className="text-3xl font-bold mb-6">Панель Администратора</h1>
      
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
            <TabButton label="Пользователи" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <TabButton label="Верификация" isActive={activeTab === 'age_verification'} onClick={() => setActiveTab('age_verification')} count={pendingAgeVerificationCount} />
            <TabButton label="Разбан" isActive={activeTab === 'unban_requests'} onClick={() => setActiveTab('unban_requests')} count={pendingUnbanCount} />
            <TabButton label="Премиум" isActive={activeTab === 'premium'} onClick={() => setActiveTab('premium')} count={pendingPremiumCount} />
            <TabButton label="Жалобы" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} count={openReportsCount} />
            <TabButton label="Тикеты" isActive={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} count={openTicketsCount} />
            <TabButton label="Оценки" isActive={activeTab === 'ratings'} onClick={() => setActiveTab('ratings')} />
        </nav>
      </div>

      {activeTab === 'age_verification' && (
        <div>
            <h2 className="text-xl font-semibold mb-4">Запросы на верификацию возраста ({pendingAgeVerificationCount})</h2>
            <div className="space-y-4">
            {ageVerificationRequests.filter(r => r.status === 'pending').map(request => (
                <div key={request.id} className="bg-gray-800 p-4 rounded-lg flex items-start gap-4">
                    <div className="flex-grow">
                        <p className="font-bold">{request.userName} (ID: {request.userId})</p>
                        <p className="text-xs text-gray-400">{new Date(request.timestamp).toLocaleString()}</p>
                        <div className="mt-4 flex gap-4">
                            <button onClick={() => handleAgeVerificationRequest(request.id, true)} className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-md">Одобрить</button>
                            <button onClick={() => handleAgeVerificationRequest(request.id, false)} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 rounded-md">Отклонить</button>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <a href={request.photoUrl} target="_blank" rel="noopener noreferrer">
                            <img src={request.photoUrl} alt="Document" className="w-40 h-auto rounded-md border border-gray-600" />
                        </a>
                        <p className="text-center text-xs text-gray-400 mt-1">Фото документа</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
      )}
      
      {activeTab === 'unban_requests' && (
         <div>
            <h2 className="text-xl font-semibold mb-4">Запросы на разбан ({pendingUnbanCount})</h2>
             <div className="space-y-4">
            {unbanRequests.filter(r => r.status === 'pending').map(request => (
                <div key={request.id} className="bg-gray-800 p-4 rounded-lg">
                    <p className="font-bold">{request.userName} (ID: {request.userId})</p>
                    <p className="text-sm text-gray-400 mt-1">Причина запроса: <span className="text-gray-200 italic">"{request.reason}"</span></p>
                    <p className="text-xs text-gray-500">{new Date(request.timestamp).toLocaleString()}</p>
                    <div className="mt-3 flex gap-4">
                        <button onClick={() => handleUnbanRequest(request.id, true)} className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-md">Одобрить</button>
                        <button onClick={() => handleUnbanRequest(request.id, false)} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 rounded-md">Отклонить</button>
                    </div>
                </div>
            ))}
            </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Все пользователи ({users.length})</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Пользователь</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Пол</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Статус</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.filter(u => u.id !== ADMIN_ID).map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full object-cover" src={user.photoUrls?.[0] || `https://i.pravatar.cc/100?u=${user.id}`} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name} (@{user.username})</div>
                              <div className="text-sm text-gray-400">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.gender === 'male' ? 'М' : 'Ж'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                                {user.isVerified && <span title="Верифицирован"><VerifiedIcon className="w-5 h-5"/></span>}
                                {user.isAgeVerified && <span className="text-green-400 text-xs font-bold" title="Возраст подтвержден">18+</span>}
                                {user.isPremium && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-yellow-900">Премиум</span>}
                                {user.isBlocked && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-red-900" title={`Причина: ${user.banReason}`}>Блок</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                          <button onClick={() => updateUser({id: user.id, isVerified: !user.isVerified})} className="text-indigo-400 hover:text-indigo-300">
                            {user.isVerified ? 'Снять вериф.' : 'Верифиц.'}
                          </button>
                          <button onClick={() => handleBlockUser(user)} className="text-red-400 hover:text-red-300">
                            {user.isBlocked ? 'Разблок.' : 'Заблок.'}
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

      {activeTab === 'reports' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Жалобы ({openReportsCount} открытых)</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">На кого/От кого</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Причина</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {reports.filter(r => r.status === 'open').map(report => (
                      <tr key={report.id}>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <p className="font-medium text-white">На: {getUserName(report.reportedId)}</p>
                            <p className="text-gray-400">От: {getUserName(report.reporterId)}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                           <button onClick={() => resolveReport(report.id)} className="text-green-400 hover:text-green-300">Закрыть</button>
                           <button onClick={() => handleBlockUser(users.find(u => u.id === report.reportedId)!)} className="text-red-400 hover:text-red-300">Заблок.</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

       {activeTab === 'premium' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Запросы на премиум ({pendingPremiumCount})</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Пользователь</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Дата</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {premiumRequests.filter(r => r.status === 'pending').map(request => (
                      <tr key={request.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{request.userName} (@{request.userTg})</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(request.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                           <a href={`https://t.me/${request.userTg}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Написать</a>
                           <button onClick={() => approvePremiumRequest(request.userId)} className="text-green-400 hover:text-green-300">Одобрить</button>
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
          <h2 className="text-xl font-semibold mb-4">Все оценки ({ratings.length})</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Кто оценил</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Кого оценили</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Оценка</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Дата</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {[...ratings].reverse().map((rating, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getUserName(rating.raterId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getUserName(rating.ratedId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {rating.isSuperLike ? 
                                <span className="text-yellow-400 font-bold">Суперлайк ✨</span> : 
                                <span className="font-bold">{rating.score}</span>
                            }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(rating.timestamp).toLocaleString()}</td>
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
            <h2 className="text-xl font-semibold mb-4">Тикеты поддержки ({openTicketsCount} открытых)</h2>
            <div className="space-y-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.status === 'open' ? 'bg-green-500 text-green-900' : 'bg-gray-600 text-gray-200'}`}>
                                    {ticket.status === 'open' ? 'ОТКРЫТ' : 'ЗАКРЫТ'}
                                </span>
                                <h3 className="text-lg font-bold mt-2">{ticket.subject}</h3>
                                <p className="text-sm text-gray-400">
                                    От: {ticket.userName} (ID: {ticket.userId}) - {new Date(ticket.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                            {ticket.status === 'open' && (
                                <button
                                    onClick={() => updateTicketStatus(ticket.id, 'closed')}
                                    className="text-sm bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-md transition"
                                >
                                    Закрыть тикет
                                </button>
                            )}
                        </div>
                        <p className="mt-3 pt-3 border-t border-gray-700 text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
                        
                        {ticket.reply && (
                            <div className="mt-2 pt-2 border-t border-gray-700">
                                <p className="text-sm font-semibold text-indigo-300">Ваш ответ:</p>
                                <p className="text-sm text-indigo-200 italic">"{ticket.reply}"</p>
                            </div>
                        )}
                        
                        {ticket.status === 'open' && !ticket.reply && (
                            <TicketReplyForm ticketId={ticket.id} onReply={replyToTicket} />
                        )}
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};