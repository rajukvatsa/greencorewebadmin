import { useState, useEffect } from "react";

interface Role {
  _id?: string;
  name: string;
  features: {
    [feature: string]: {
      viewOwn: boolean;
      viewGlobal: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

const FEATURES = ["Contracts", "Users", "Schedule", "Notifications", "Reports"];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Omit<Role, "_id">>({ name: "", features: {} });

  const resetForm = () => {
    setFormData({
      name: "",
      features: FEATURES.reduce((acc, feature) => {
        acc[feature] = { viewOwn: false, viewGlobal: false, create: false, edit: false, delete: false };
        return acc;
      }, {} as Role["features"]),
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingRole(null);
    setShowModal(true);
  };

  const openEditModal = (role: Role) => {
    setFormData({ name: role.name, features: { ...role.features } });
    setEditingRole(role);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingRole) {
        await fetch('/api/roles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingRole._id, ...formData }),
        });
      } else {
        await fetch('/api/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      await fetchRoles();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const updateFeatureCapability = (feature: string, capability: keyof Role["features"][string], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: {
          ...prev.features[feature],
          [capability]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-500">Manage user roles and their feature capabilities</p>
        </div>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
        >
          Add Role
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Features
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : roles.map((role) => (
              <tr key={role._id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{role.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(role.features).map(([feature, capabilities]) => {
                      const activeCount = Object.values(capabilities).filter(Boolean).length;
                      return (
                        <span
                          key={feature}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800"
                        >
                          {feature} ({activeCount})
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => openEditModal(role)}
                    className="mr-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role._id!)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingRole ? "Edit Role" : "Add New Role"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium text-slate-900">Feature Capabilities</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border-r border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">
                          Feature
                        </th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700">
                          View (Own)
                        </th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700">
                          View (Global)
                        </th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700">
                          Create
                        </th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700">
                          Edit
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-slate-700">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {FEATURES.map((feature) => (
                        <tr key={feature} className="border-t border-slate-200">
                          <td className="border-r border-slate-200 px-4 py-3 font-medium text-slate-900">
                            {feature}
                          </td>
                          {["viewOwn", "viewGlobal", "create", "edit", "delete"].map((capability) => (
                            <td key={capability} className="border-r border-slate-200 px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={formData.features[feature]?.[capability as keyof Role["features"][string]] || false}
                                onChange={(e) => updateFeatureCapability(feature, capability as keyof Role["features"][string], e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500 cursor-pointer"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                disabled={!formData.name.trim()}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
              >
                {editingRole ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}