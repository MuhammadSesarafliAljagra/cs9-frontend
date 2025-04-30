import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllStores } from "../../services/storeService";
import { AuthContext } from "../../contexts/AuthContext";
import StoreCard from "../../components/stores/StoreCard";
import Button from "../../components/common/Button";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await getAllStores();
        setStores(storesData);
        setFilteredStores(storesData);
      } catch (err) {
        setError("Failed to load stores. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    // Filter stores based on search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      setFilteredStores(
        stores.filter(
          (store) =>
            store.name.toLowerCase().includes(searchLower) ||
            (store.description &&
              store.description.toLowerCase().includes(searchLower))
        )
      );
    } else {
      setFilteredStores(stores);
    }
  }, [searchTerm, stores]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="text-center py-10">Loading stores...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Stores</h1>
        {user && (
          <Link to="/stores/add">
            <Button>Add New Store</Button>
          </Link>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No stores found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoresList;