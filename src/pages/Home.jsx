import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { getAllItems } from "../services/itemService";
import { getAllStores } from "../services/storeService";
import ItemCard from "../components/items/ItemCard";
import Skeleton from "../components/common/Skeleton";
import Button from "../components/common/Button";
import { BsArrowRight, BsSun, BsMoon, BsSearch } from "react-icons/bs";
import { FaStore, FaShoppingBag } from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularStores, setPopularStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  const fetchData = async () => {
    try {
      const [itemsResponse, storesResponse] = await Promise.all([
        getAllItems(),
        getAllStores(),
      ]);

      // Extract the items array from the response
      const itemsArray = Array.isArray(itemsResponse)
        ? itemsResponse
        : itemsResponse?.payload || itemsResponse?.data || [];

      // Get a few random items to feature
      setFeaturedItems(itemsArray.slice(0, 8));

      // Extract the stores array from the response
      const storesArray = Array.isArray(storesResponse)
        ? storesResponse
        : storesResponse?.payload || storesResponse?.data || [];

      // Calculate item counts for each store
      const storesWithCounts = storesArray.map((store) => {
        const storeItems = itemsArray.filter(
          (item) => item.store_id === store.id
        );
        return {
          ...store,
          itemCount: storeItems.length,
        };
      });

      setPopularStores(storesWithCounts.slice(0, 3));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 md:p-6">
      {/* Dark Mode Toggle - This can be removed if you prefer using only the Navbar toggle */}
      <div className="fixed top-20 right-5 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
              : "bg-white hover:bg-gray-100 shadow-md"
          } transition-all duration-300`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <BsSun className="h-6 w-6 text-yellow-400" />
          ) : (
            <BsMoon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section
          className={`rounded-2xl p-8 md:p-12 text-center shadow-lg transition-all mt-10 ${
            darkMode
              ? "bg-gradient-to-r from-blue-900 to-purple-900 text-white"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
              Welcome to CS Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fadeIn animation-delay-200">
              Discover amazing products from various stores all in one place
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn animation-delay-300">
              <Link
                to="/items"
                className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                Browse Products
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-300 ${
                    darkMode
                      ? "bg-transparent border-2 border-gray-300 text-gray-300 hover:bg-gray-800"
                      : "bg-transparent border-2 border-white text-white hover:bg-white/10"
                  }`}
                >
                  Join Now
                </Link>
              )}
            </div>

            {/* Search Bar */}
            <div className="mt-12 relative max-w-xl mx-auto animate-fadeIn animation-delay-400">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className={`w-full py-4 px-6 pr-12 rounded-full focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-800 text-white border border-gray-700 focus:ring-blue-500"
                      : "bg-white text-gray-800 focus:ring-blue-400"
                  } shadow-md`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Link
                  to={`/items?search=${searchTerm}`}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 ${
                    darkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  <BsSearch className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section
          title="Featured Products"
          linkTo="/items"
          animationDelay="animation-delay-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl md:text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Featured Products
            </h2>
            <Link
              to="/items"
              className={`flex items-center ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              View all <BsArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} height="320px" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="transform hover:-translate-y-2 transition-all duration-300"
                >
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Popular Stores */}
        <section
          className={`rounded-2xl p-8 shadow-lg animate-fadeUp animation-delay-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h2
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Popular Stores
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} height="200px" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularStores.map((store) => (
                <Link
                  key={store.id}
                  to={`/stores/${store.id}`}
                  className={`rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-full ${
                        darkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <FaStore className="h-8 w-8" />
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`font-semibold text-lg ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {store.name}
                      </h3>
                      <p
                        className={`mt-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {store.itemCount || Math.floor(Math.random() * 50) + 10}{" "}
                        products available
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section
          className={`rounded-2xl p-8 md:p-12 text-white shadow-lg animate-fadeUp animation-delay-500 ${
            darkMode
              ? "bg-gradient-to-r from-purple-900 to-blue-900 border border-gray-700"
              : "bg-gradient-to-r from-purple-600 to-blue-600"
          }`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with New Products
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Subscribe to our newsletter for exclusive deals and updates
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className={`flex-grow px-6 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-800 text-white border border-gray-700 focus:ring-blue-500"
                    : "bg-white text-gray-800 focus:ring-blue-300"
                }`}
                required
              />
              <button
                type="submit"
                className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-300 ${
                  darkMode
                    ? "bg-blue-800 hover:bg-blue-700 text-white"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;