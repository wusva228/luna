import React, { useState } from 'react';
import type { Ticket } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string, message: string) => void;
  userTickets: Ticket[];
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onSubmit, userTickets }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Пожалуйста, укажите тему и сообщение.");
      return;
    }
    onSubmit(subject, message);
    setSubject('');
    setMessage('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
        onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-lg p-6 relative border border-gray-700 animate-slide-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Связаться с поддержкой</h2>
        
        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-300 mb-4">Создайте новый тикет. Наша команда скоро его рассмотрит.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Тема</label>
                    <input
                      type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)}
                      className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500" required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">Сообщение</label>
                    <textarea
                      id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)}
                      className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 resize-none" required
                    />
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors">Отправить</button>
                  </div>
                </form>
            </div>
            
            {userTickets.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">История обращений</h3>
                    <div className="space-y-3">
                        {userTickets.map(ticket => (
                             <div key={ticket.id} className="bg-gray-700/50 p-3 rounded-lg text-sm">
                               <div className="flex justify-between items-center">
                                <p className="font-bold">{ticket.subject}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-green-600' : 'bg-gray-500'}`}>{ticket.status}</span>
                               </div>
                               <p className="text-gray-300 mt-1">{ticket.message}</p>
                               {ticket.reply && (
                                    <div className="mt-2 pt-2 border-t border-gray-600">
                                        <p className="font-semibold text-indigo-300">Ответ:</p>
                                        <p className="italic text-indigo-200">"{ticket.reply}"</p>
                                    </div>
                               )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};