import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = ({ user }) => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState({ emailAlerts: false, pushNotifications: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.email) {
      setError("User not logged in");
      return;
    }

    axios.get("http://localhost:5000/user/settings", { params: { email: user.email } })
      .then(response => {
        setProfile(response.data.profile || { name: "", email: user.email });
        setNotifications(response.data.notifications || { emailAlerts: false, pushNotifications: false });
      })
      .catch(error => {
        console.error("Error fetching settings:", error);
        setError("Failed to load settings");
      });
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await axios.put("http://localhost:5000/user/settings", { profile });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return alert("Enter a new password!");
    setLoading(true);
    try {
      await axios.put("http://localhost:5000/user/change-password", { email: user.email, password: newPassword });
      alert("Password updated successfully!");
    } catch (error) {
      alert("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/user/enable-2fa", { email: user.email });
      alert("2FA Enabled!");
    } catch (error) {
      alert("Failed to enable 2FA.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async () => {
    setLoading(true);
    try {
      await axios.put("http://localhost:5000/user/settings", { notifications });
      alert("Notification settings updated!");
    } catch (error) {
      alert("Failed to update notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setLoading(true);
    try {
      await axios.delete("http://localhost:5000/user/delete-account", { data: { email: user.email } });
      alert("Account deleted successfully.");
    } catch (error) {
      alert("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="mb-5">
        <h3 className="text-md font-medium">Account Information</h3>
        <input className="border p-2 w-full mt-2 rounded" placeholder="Name" value={profile.name} 
               onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <input className="border p-2 w-full mt-2 rounded" placeholder="Email" value={profile.email} disabled />
        <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded" onClick={handleProfileUpdate} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="mb-5">
        <h3 className="text-md font-medium">Security</h3>
        <input className="border p-2 w-full mt-2 rounded" type="password" placeholder="New Password" 
               onChange={(e) => setNewPassword(e.target.value)} />
        <button className="mt-2 bg-red-500 text-white py-2 px-4 rounded" onClick={handleChangePassword} disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
        <button className="mt-2 ml-2 bg-green-500 text-white py-2 px-4 rounded" onClick={handleEnable2FA} disabled={loading}>
          {loading ? "Enabling..." : "Enable 2FA"}
        </button>
      </div>

      <div className="mb-5">
        <h3 className="text-md font-medium">Notifications</h3>
        <label className="block mt-2">
          <input type="checkbox" className="mr-2" checked={notifications.emailAlerts} 
                 onChange={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })} />
          Email Alerts
        </label>
        <label className="block mt-2">
          <input type="checkbox" className="mr-2" checked={notifications.pushNotifications} 
                 onChange={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })} />
          Push Notifications
        </label>
        <button className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded" onClick={handleNotificationChange} disabled={loading}>
          {loading ? "Saving..." : "Update Notifications"}
        </button>
      </div>

      <div className="mt-5">
        <h3 className="text-md font-medium text-red-600">Danger Zone</h3>
        <button className="mt-2 bg-red-600 text-white py-2 px-4 rounded" onClick={handleDeleteAccount} disabled={loading}>
          {loading ? "Processing..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
