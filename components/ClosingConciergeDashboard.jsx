import React, { useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, FileText, Phone, Mail, Clock } from 'lucide-react';

const ClosingConciergeDashboard = ({ transactionId = 'TXN-2024-001' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Final walkthrough scheduled', completed: true, dueDate: '2024-10-15' },
    { id: 2, task: 'Homeowner insurance proof received', completed: true, dueDate: '2024-10-16' },
    { id: 3, task: 'Final title report reviewed', completed: false, dueDate: '2024-10-17' },
    { id: 4, task: 'Closing disclosure signed', completed: false, dueDate: '2024-10-17' },
    { id: 5, task: 'Wire instructions confirmed', completed: false, dueDate: '2024-10-18' },
    { id: 6, task: 'Hazard insurance binder obtained', completed: false, dueDate: '2024-10-18' },
  ]);

  const closingDate = new Date('2024-10-19');
  const today = new Date('2024-10-16');
  const daysUntilClosing = Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24));

  const toggleTask = (id) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const contacts = [
    { name: 'Title Company', role: 'Amy Earl', phone: '239-555-0123', email: 'amy@titleco.com' },
    { name: 'Lender', role: 'Mortgage Officer', phone: '239-555-0124', email: 'loan@lender.com' },
    { name: 'Buyer', role: 'Primary Contact', phone: '239-555-0125', email: 'buyer@email.com' },
    { name: 'Seller', role: 'Primary Contact', phone: '239-555-0126', email: 'seller@email.com' },
  ];

  const completionRate = Math.round((checklist.filter(c => c.completed).length / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Closing Concierge</h1>
              <p className="text-slate-600">Transaction ID: {transactionId}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-amber-600 mb-2">{daysUntilClosing}</div>
              <p className="text-slate-600">days until closing</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Closing Date</p>
                <p className="text-2xl font-bold text-slate-900">October 19, 2024</p>
              </div>
              <Calendar className="w-12 h-12 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {['overview', 'checklist', 'contacts', 'documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Closing Preparation Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Overall Completion</span>
                  <span className="text-sm font-bold text-amber-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-amber-500 h-3 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-slate-700">{checklist.filter(c => c.completed).length} items completed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-slate-700">{checklist.filter(c => !c.completed).length} items remaining</span>
                </div>
              </div>
            </div>

            {/* Key Milestones */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Critical Milestones</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                  <Clock className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Today</p>
                    <p className="text-sm text-slate-600">Review final title report</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                  <Clock className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Oct 17</p>
                    <p className="text-sm text-slate-600">Closing Disclosure due</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Oct 19</p>
                    <p className="text-sm text-slate-600">Closing day at 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Closing Checklist</h2>
            <div className="space-y-2">
              {checklist.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    item.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTask(item.id)}
                    className="w-5 h-5 text-amber-600 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.task}
                    </p>
                    <p className="text-sm text-slate-500">Due: {item.dueDate}</p>
                  </div>
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{contact.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{contact.role}</p>
                <div className="space-y-3">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-amber-600" />
                    <span className="text-slate-900 font-medium">{contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-amber-600" />
                    <span className="text-slate-900 font-medium text-sm truncate">{contact.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Closing Documents</h2>
            <div className="space-y-3">
              {[
                { name: 'Closing Disclosure', status: 'pending', uploaded: false },
                { name: 'Title Report (Final)', status: 'pending', uploaded: false },
                { name: 'HOA Documents', status: 'complete', uploaded: true },
                { name: 'Insurance Commitment', status: 'pending', uploaded: false },
                { name: 'Survey', status: 'complete', uploaded: true },
                { name: 'Appraisal', status: 'complete', uploaded: true },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    doc.uploaded
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-5 h-5 ${doc.uploaded ? 'text-green-600' : 'text-amber-600'}`} />
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-600 capitalize">{doc.status}</p>
                    </div>
                  </div>
                  {doc.uploaded ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosingConciergeDashboard;