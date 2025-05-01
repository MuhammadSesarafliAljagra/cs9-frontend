import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import Button from "../../components/common/Button";

const TopUp = () => {
  const { user, setUser } = useContext(AuthContext); // Add setUser from AuthContext
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Predefined amounts for quick selection
  const predefinedAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Backend validation requirements
    if (!amount) {
      setError("Amount is required");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      setError("Amount must be a valid number");
      return;
    }

    if (amountValue <= 0) {
      setError("Amount must be larger than 0");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Make API call to top up user balance
      const response = await fetch(
        `https://cs9-backend.vercel.app/user/topUp?id=${encodeURIComponent(
          user.id
        )}&amount=${encodeURIComponent(amount)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Top up failed. Please try again.");
      }

      console.log("Top-up successful:", result);

      // Create updated user object with new balance
      const updatedUser = {
        ...user,
        balance:
          result.payload.balance ||
          parseFloat(user.balance) + parseFloat(amount),
      };

      // Update user in local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update AuthContext user state - this will update the UI everywhere
      if (setUser) {
        setUser(updatedUser);
      } else {
        console.warn("setUser function not available in AuthContext");
        // Force reload as fallback
        window.location.reload();
      }

      setSuccess("Your balance has been topped up successfully!");
      setAmount(""); // Reset amount field

      // Redirect after successful top-up
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Top-up error:", err);
      setError(err.message || "Failed to top up balance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectAmount = (amt) => {
    setAmount(amt.toString());
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className={`max-w-md mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <h1 className="text-2xl font-bold mb-6">Top Up Balance</h1>

      {/* Current Balance Card */}
      <div
        className={`${
          darkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-gray-50 border-gray-200"
        } p-4 rounded-lg mb-6 border`}
      >
        <p
          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
        >
          Current Balance
        </p>
        <p
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Rp. {user.balance ? parseFloat(user.balance).toFixed(2) : "0.00"}
        </p>
      </div>

      {error && (
        <div
          className={`${
            darkMode
              ? "bg-red-900 border-red-800 text-red-200"
              : "bg-red-100 border-red-400 text-red-700"
          } px-4 py-3 rounded mb-4 border`}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className={`${
            darkMode
              ? "bg-green-900 border-green-800 text-green-200"
              : "bg-green-100 border-green-400 text-green-700"
          } px-4 py-3 rounded mb-4 border`}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Instructions based on backend requirements */}
        <div
          className={`mb-6 p-4 rounded-lg ${
            darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600"
          }`}
        >
          <h3
            className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            } mb-2`}
          >
            Top-up Requirements:
          </h3>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li>Minimum amount is Rp 1,000</li>
            <li>Amount must be a positive number</li>
            <li>Balance will be instantly updated after successful top-up</li>
          </ul>
        </div>

        {/* Predefined amounts */}
        <div className="mb-6">
          <label
            className={`block text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => selectAmount(amt)}
                className={`py-2 px-3 text-sm font-medium rounded-lg border ${
                  amount === amt.toString()
                    ? darkMode
                      ? "bg-primary-900 border-primary-700 text-primary-300"
                      : "bg-primary-100 border-primary-500 text-primary-700"
                    : darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Rp. {amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount input */}
        <div className="mb-6">
          <label
            className={`block text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Custom Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } sm:text-sm`}
              >
                Rp.
              </span>
            </div>
            <input
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`pl-12 block w-full px-4 py-2 border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500"
              } rounded-md shadow-sm focus:outline-none`}
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Payment method - simplified for now */}
        <div className="mb-6">
          <label
            className={`block text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Payment Method
          </label>
          <select
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            defaultValue="credit_card"
          >
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="e_wallet">E-Wallet</option>
          </select>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          variant={darkMode ? "primary-dark" : "primary"}
        >
          {loading ? "Processing..." : "Top Up Balance"}
        </Button>
      </form>

      <button
        onClick={() => navigate(-1)}
        className={`mt-4 w-full text-center ${
          darkMode
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Cancel
      </button>
    </div>
  );
};

export default TopUp;
