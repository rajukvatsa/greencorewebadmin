import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Client {
  _id: string;
  name: string;
}

interface Credit {
  _id: string;
  clientId: string;
  clientName: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  description: string;
  createdAt: string;
}

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    amount: "",
    type: "deposit" as 'deposit' | 'withdraw',
    description: "",
  });
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchCredits();
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchWalletData(selectedClient);
    }
  }, [selectedClient]);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits');
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchWalletData = async (clientId: string) => {
    try {
      const response = await fetch(`/api/wallet/${clientId}`);
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const openAddModal = () => {
    setFormData({ clientId: "", amount: "", type: "deposit", description: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.clientId || !formData.amount) {
      alert('Client and amount are required');
      return;
    }

    try {
      await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await fetchCredits();
      if (selectedClient) {
        await fetchWalletData(selectedClient);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving credit:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Credits</h1>
          <p className="text-sm text-slate-500">Manage client wallet transactions</p>
        </div>
        {hasPermission('Schedule', 'create') && (
          <button
            onClick={openAddModal}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
          >
            Add Transaction
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Client Wallet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {walletData && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Current Balance</div>
                  <div className={`text-2xl font-bold ${walletData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${walletData.balance.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-900">
                {selectedClient ? 'Client Transaction History' : 'All Transactions'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                        Loading...
                      </td>
                    </tr>
                  ) : (selectedClient ? walletData?.transactions || [] : credits || []).map((credit: Credit) => (
                    <tr key={credit._id}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {credit.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          credit.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {credit.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        credit.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {credit.type === 'deposit' ? '+' : '-'}${credit.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{credit.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(credit.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Add Transaction</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 cursor-pointer"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'deposit' | 'withdraw' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}