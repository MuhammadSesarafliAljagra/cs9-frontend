import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getAllItems } from "../services/itemService";
import { getAllStores } from "../services/storeService";
import ItemCard from "../components/items/ItemCard";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularStores, setPopularStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await getAllItems();
        // Log to see the actual structure
        console.log("Items response:", itemsResponse);

        // Extract the items array from the response
        const itemsArray = Array.isArray(itemsResponse)
          ? itemsResponse
          : itemsResponse?.payload || itemsResponse?.data || [];

        // Get a few random items to feature
        setFeaturedItems(itemsArray.slice(0, 4));

        const storesResponse = await getAllStores();
        console.log("Stores response:", storesResponse);

        // Extract the stores array from the response
        const storesArray = Array.isArray(storesResponse)
          ? storesResponse
          : storesResponse?.payload || storesResponse?.data || [];

        setPopularStores(storesArray.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to CS Store</h1>
        <p className="text-xl mb-6">
          Discover amazing products from our stores
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/items"
            className="bg-white text-indigo-700 px-6 py-2 rounded-md hover:bg-indigo-100"
          >
            Browse Products
          </Link>
          {!user && (
            <Link
              to="/register"
              className="bg-transparent border border-white px-6 py-2 rounded-md hover:bg-indigo-600"
            >
              Sign Up
            </Link>
          )}
        </div>
      </section>

      {/* Featured Items Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <Link to="/items" className="text-indigo-600 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading items...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Stores Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Our Stores</h2>
          <Link to="/stores" className="text-indigo-600 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading stores...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularStores.map((store) => (
              <Link
                key={store.id}
                to={`/stores/${store.id}`}
                className="block p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                <p className="text-gray-600 mb-4">
                  {store.description || "No description available"}
                </p>
                <span className="text-indigo-600">View store →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
