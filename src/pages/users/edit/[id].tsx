import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Role {
  _id: string;
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

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
}

export default function EditUserPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    profileImage: "",
    permissions: {} as any,
  });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchRoles();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      const defaultPermissions = ["Contracts", "Users", "Schedule", "Notifications", "Reports"].reduce((acc, feature) => {
        acc[feature] = { viewOwn: false, viewGlobal: false, create: false, edit: false, delete: false };
        return acc;
      }, {} as any);
      
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        role: typeof user.role === 'object' ? user.role._id || user.role : user.role,
        profileImage: user.profileImage || "",
        permissions: user.permissions ? { ...defaultPermissions, ...user.permissions } : { ...defaultPermissions, ...user.effectivePermissions },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleRoleChange = (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    setSelectedRole(role || null);
    if (role && (!formData.permissions || Object.keys(formData.permissions).length === 0)) {
      setFormData({ ...formData, role: roleId, permissions: { ...role.features } });
    } else {
      setFormData({ ...formData, role: roleId });
    }
  };

  const updatePermission = (feature: string, capability: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [feature]: {
          ...prev.permissions[feature] || { viewOwn: false, viewGlobal: false, create: false, edit: false, delete: false },
          [capability]: value,
        },
      },
    }));
  };

  useEffect(() => {
    if (formData.role && roles.length > 0) {
      const role = roles.find(r => r._id === formData.role);
      setSelectedRole(role || null);
    }
  }, [formData.role, roles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData }),
      });
      router.push('/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit User</h1>
          <p className="text-sm text-slate-500">Update user account details</p>
        </div>
        <Link
          href="/users"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Back to Users
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === "profile"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === "permissions"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Permissions
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="" className="h-20 w-20 rounded-full" />
                    ) : (
                      <span className="text-slate-400">No Image</span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                    required
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.role && (
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">User Permissions</h3>
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
                        {["Contracts", "Users", "Schedule", "Notifications", "Reports"].map((feature) => (
                          <tr key={feature} className="border-t border-slate-200">
                            <td className="border-r border-slate-200 px-4 py-3 font-medium text-slate-900">
                              {feature}
                            </td>
                            {["viewOwn", "viewGlobal", "create", "edit", "delete"].map((capability) => (
                              <td key={capability} className="border-r border-slate-200 px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={formData.permissions[feature]?.[capability] || false}
                                  onChange={(e) => updatePermission(feature, capability, e.target.checked)}
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
              )}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/users"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}