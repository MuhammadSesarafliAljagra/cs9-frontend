import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStoreById, deleteStore } from "../../services/storeService";
import { getAllItems } from "../../services/itemService";
import { AuthContext } from "../../contexts/AuthContext";
import ItemCard from "../../components/items/ItemCard";
import Button from "../../components/common/Button";

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStoreAndItems = async () => {
      try {
        const storeData = await getStoreById(id);
        setStore(storeData);

        // Fetch all items and filter those belonging to this store
        const allItems = await getAllItems();
        const storeItems = allItems.filter((item) => item.storeId === id);
        setItems(storeItems);
      } catch (err) {
        setError("Failed to load store details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndItems();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteStore(id);
        navigate("/stores", {
          state: { message: "Store deleted successfully" },
        });
      } catch (err) {
        setError("Failed to delete the store. Please try again later.");
        console.error(err);
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading store details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
        <p className="mb-4">
          The store you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/stores">
          <Button>Go back to stores</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Store Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Store Image/Banner */}
          <div className="md:w-1/3 bg-indigo-700 flex items-center justify-center h-48 md:h-auto">
            {store.imageUrl ? (
              <img
                src={store.imageUrl}
                alt={store.name}
                className="object-cover h-full w-full"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {store.name}
              </span>
            )}
          </div>

          {/* Store Details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{store.name}</h1>

            {store.address && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-500 mb-1">
                  Address
                </h2>
                <p>{store.address}</p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Description
              </h2>
              <p className="text-gray-700">
                {store.description || "No description available."}
              </p>
            </div>

            {/* Admin Options */}
            {user && (
              <div className="border-t pt-4 mt-6 flex space-x-4">
                <Link to={`/stores/edit/${store.id}`}>
                  <Button variant="secondary">Edit Store</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Store"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Store Items */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Store Items</h2>
          {user && (
            <Link to={`/items/add?storeId=${id}`}>
              <Button>Add Item to Store</Button>
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              This store doesn't have any items yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;