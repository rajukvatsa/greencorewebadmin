import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Client {
  _id: string;
  name: string;
  vatNumber: string;
  phone: string;
  email: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    vatNumber: "",
    phone: "",
    email: "",
  });
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", vatNumber: "", phone: "", email: "" });
  };

  const openAddModal = () => {
    resetForm();
    setEditingClient(null);
    setShowModal(true);
  };

  const openEditModal = (client: Client) => {
    setFormData({
      name: client.name,
      vatNumber: client.vatNumber,
      phone: client.phone,
      email: client.email,
    });
    setEditingClient(client);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    try {
      if (editingClient) {
        await fetch('/api/clients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingClient._id, ...formData }),
        });
      } else {
        await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      await fetchClients();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await fetch('/api/clients', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        await fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500">Manage client information and contacts</p>
        </div>
        {hasPermission('Schedule', 'create') && (
          <button
            onClick={openAddModal}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
          >
            Add Client
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                VAT Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : clients.map((client) => (
              <tr key={client._id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{client.name}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{client.vatNumber}</td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  <div>{client.email}</div>
                  <div className="text-slate-500">{client.phone}</div>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  {hasPermission('Schedule', 'edit') && (
                    <button
                      onClick={() => openEditModal(client)}
                      className="mr-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                  {hasPermission('Schedule', 'delete') && (
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingClient ? "Edit Client" : "Add New Client"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">VAT Number</label>
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                  required
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
                {editingClient ? "Update Client" : "Create Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}