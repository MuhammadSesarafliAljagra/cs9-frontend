import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createItem } from "../../services/itemService";
import ItemForm from "../../components/items/ItemForm";

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Extract storeId from URL query params if coming from a store page
  const queryParams = new URLSearchParams(location.search);
  const preselectedStoreId = queryParams.get("storeId");

  const handleSubmit = async (itemData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Submitting item data to API:", itemData);
      const response = await createItem(itemData);
      console.log("API response:", response);

      // Navigate to the newly created item page or items list
      if (response && response.payload) {
        if (response.payload.id === "pending") {
          // Special case for connection errors where item might have been created
          setSuccess(true);
          setTimeout(() => {
            navigate(`/items`, {
              state: {
                message: "Item may have been created. Please check the list.",
              },
            });
          }, 3000); // Wait 3 seconds before redirecting
        } else {
          // Normal case - item created successfully with ID
          navigate(`/items/${response.payload.id}`, {
            state: { message: "Item created successfully" },
          });
        }
      } else {
        throw new Error("Failed to create item: Invalid response");
      }
    } catch (err) {
      console.error("Error creating item:", err);
      setError("Failed to create item: " + (err.message || "Please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Item</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded my-4">
          Item may have been created despite connection issues. Redirecting to
          items list...
        </div>
      )}

      <ItemForm
        onSubmit={handleSubmit}
        isLoading={loading || success}
        initialStoreId={preselectedStoreId}
      />
    </div>
  );
};

export default AddItem;
