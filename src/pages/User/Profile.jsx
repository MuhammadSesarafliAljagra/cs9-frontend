import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { updateProfile } from "../../services/authService";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [topUpAmount, setTopUpAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Check if passwords match when changing password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setMessage({
          type: "error",
          text: "Current password is required to set a new password",
        });
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({
          type: "error",
          text: "New password and confirmation do not match",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for update (only include password fields if changing password)
      const updateData = {
        name: formData.name,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await updateProfile(updateData);
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();

    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid amount to top up",
      });
      return;
    }

    setTopUpLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Make API call to top up user balance
      const response = await fetch(
        `https://cs9-backend.vercel.app/user/topUp?id=${encodeURIComponent(
          user.id
        )}&amount=${encodeURIComponent(topUpAmount)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Top up failed. Please try again.");
      }

      const result = await response.json();

      // Update user in local storage with new balance
      const updatedUser = { ...user, balance: result.payload.balance };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update AuthContext user state - this will update the UI everywhere
      setUser(updatedUser);

      setMessage({
        type: "success",
        text: "Balance topped up successfully",
      });

      setTopUpAmount("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to top up balance. Please try again.",
      });
    } finally {
      setTopUpLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* User Balance Card */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-gray-500">
              Current Balance
            </h2>
            <p className="text-xl font-bold text-gray-800">
              Rp. {user.balance ? parseFloat(user.balance).toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="bg-primary-100 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Up Form */}
      <form
        onSubmit={handleTopUp}
        className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h2 className="text-lg font-semibold mb-4">Top Up Balance</h2>
        <div className="flex space-x-2">
          <input
            type="number"
            min="1000"
            step="1000"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter amount"
          />
          <Button type="submit" disabled={topUpLoading}>
            {topUpLoading ? "Processing..." : "Top Up"}
          </Button>
        </div>
      </form>

      {/* Profile Update Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="bg-gray-100"
        />

        <hr className="my-6" />

        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Leave blank if you don't want to change your password
        </p>

        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
        />

        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
        />

        <div className="pt-4">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t">
        <Button variant="danger" fullWidth onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
