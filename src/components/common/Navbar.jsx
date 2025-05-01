import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-600 dark:bg-gray-900 text-white shadow-lg sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 mr-2"
            >
              <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-2.977 2.625v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5A3 3 0 0 0 18.75 9H5.25Z" />
            </svg>
            CS Store
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/items" className="hover:text-primary-200 transition">
              Items
            </Link>
            <Link to="/stores" className="hover:text-primary-200 transition">
              Stores
            </Link>
            {user && (
              <>
                <Link
                  to="/transactions"
                  className="hover:text-primary-200 transition"
                >
                  Transactions
                </Link>
                <Link
                  to="/cart"
                  className="hover:text-primary-200 transition relative"
                >
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 bg-primary-700 dark:bg-gray-800 px-3 py-2 rounded-full">
                  <span>{user.name ? user.name.split(" ")[0] : "User"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 origin-top-right transition-all duration-200 z-50">
                  {/* User Balance Card */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Current Balance
                    </p>
                    <p className="text-gray-800 dark:text-white font-semibold">
                      Rp.{" "}
                      {user.balance
                        ? parseFloat(user.balance).toFixed(2)
                        : "0.00"}
                    </p>
                    <Link
                      to="/topup"
                      className="mt-2 block text-center text-sm bg-green-600 hover:bg-green-700 text-white py-1 rounded-md transition-colors"
                    >
                      Top Up Balance
                    </Link>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="hover:text-primary-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-4 pt-4 border-t border-primary-500 dark:border-gray-700 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link
                to="/items"
                className="hover:bg-primary-700 dark:hover:bg-gray-800 px-2 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Items
              </Link>
              <Link
                to="/stores"
                className="hover:bg-primary-700 dark:hover:bg-gray-800 px-2 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Stores
              </Link>
              {user ? (
                <>
                  {/* User Balance (Mobile) */}
                  <div className="px-2 py-3 bg-primary-700 dark:bg-gray-800 rounded mb-2">
                    <p className="text-sm opacity-80">Balance</p>
                    <p className="font-semibold">
                      Rp.{" "}
                      {user.balance
                        ? parseFloat(user.balance).toFixed(2)
                        : "0.00"}
                    </p>
                    <Link
                      to="/topup"
                      className="mt-2 block text-center text-sm bg-green-600 hover:bg-green-700 text-white py-1 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Top Up Balance
                    </Link>
                  </div>

                  <Link
                    to="/transactions"
                    className="hover:bg-primary-700 dark:hover:bg-gray-800 px-2 py-1 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Transactions
                  </Link>
                  <Link
                    to="/cart"
                    className="hover:bg-primary-700 dark:hover:bg-gray-800 px-2 py-1 rounded flex justify-between items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                    {cart.length > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="hover:bg-primary-700 dark:hover:bg-gray-800 px-2 py-1 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-400 hover:bg-primary-700 dark:hover:bg-gray-800 px-2 py-1 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-primary-500 dark:border-gray-700">
                  <Link
                    to="/login"
                    className="bg-primary-700 dark:bg-gray-800 hover:bg-primary-800 dark:hover:bg-gray-700 px-4 py-2 rounded text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;