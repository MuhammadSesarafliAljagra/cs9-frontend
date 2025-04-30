import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItemById, deleteItem } from "../../services/itemService";
import { getStoreById } from "../../services/storeService";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import Button from "../../components/common/Button";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [item, setItem] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemData = await getItemById(id);
        setItem(itemData);

        // Fetch the store information
        if (itemData.storeId) {
          const storeData = await getStoreById(itemData.storeId);
          setStore(storeData);
        }
      } catch (err) {
        setError("Failed to load item details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      quantity,
    });
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteItem(id);
        navigate("/items", { state: { message: "Item deleted successfully" } });
      } catch (err) {
        setError("Failed to delete the item. Please try again later.");
        console.error(err);
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading item details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p className="mb-4">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/items">
          <Button>Go back to items</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gray-200 flex items-center justify-center h-64 md:h-auto">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="object-cover h-full w-full"
            />
          ) : (
            <div className="text-gray-400 text-xl">No image available</div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-6">
          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>

          {store && (
            <Link
              to={`/stores/${store.id}`}
              className="text-indigo-600 hover:underline mb-4 block"
            >
              {store.name}
            </Link>
          )}

          <div className="text-2xl font-bold text-indigo-700 mb-4">
            Rp. {parseFloat(item.price).toFixed(2)}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {item.description || "No description available."}
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-end mb-6">
            <div className="mr-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </div>

          {/* Admin Options */}
          {user && (
            <div className="border-t pt-4 mt-6 flex space-x-4">
              <Link to={`/items/edit/${item.id}`}>
                <Button variant="secondary">Edit Item</Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Item"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;