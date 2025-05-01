import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllItems } from "../../services/itemService";
import { getAllStores } from "../../services/storeService";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import ItemCard from "../../components/items/ItemCard";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import Message from "../../components/common/Message";
import PageContainer from "../../components/layout/PageContainer";

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    storeId: "",
    minPrice: "",
    maxPrice: "",
  });

  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, storesData] = await Promise.all([
          getAllItems(),
          getAllStores(),
        ]);
        setItems(itemsData);
        setFilteredItems(itemsData);
        setStores(storesData);
      } catch (err) {
        setError("Failed to load items. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters state changes
    let result = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          (item.description &&
            item.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.storeId) {
      result = result.filter((item) => item.storeId === filters.storeId);
    }

    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      result = result.filter((item) => parseFloat(item.price) >= min);
    }

    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter((item) => parseFloat(item.price) <= max);
    }

    setFilteredItems(result);
  }, [filters, items]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      storeId: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  if (loading) {
    return (
      <PageContainer title="All Items">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} height="320px" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Message type="error">{error}</Message>
      </PageContainer>
    );
  }

  const ActionsButton = user ? (
    <Link to="/items/add">
      <Button>Add New Item</Button>
    </Link>
  ) : null;

  return (
    <PageContainer title="All Items" actions={ActionsButton}>
      {/* Filters */}
      {/* <div
        className={`p-4 rounded-lg mb-6 ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <h1 className="text-3xl font-bold">All Items</h1>
        {user && (
          <Link to="/items/add">
            <Button>Add New Item</Button>
          </Link>
        )}
      </div> */}

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store
            </label>
            <select
              name="storeId"
              value={filters.storeId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Stores</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-4 text-right">
          <Button variant="secondary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div
          className={`text-center py-10 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            No items found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
export default ItemsList;
