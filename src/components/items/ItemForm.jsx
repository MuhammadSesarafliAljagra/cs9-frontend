import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import { getAllStores } from "../../services/storeService";

const ItemForm = ({ item, onSubmit, isLoading, initialStoreId }) => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    store_id: initialStoreId || "", // Use initialStoreId if provided
    stock: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If editing an existing item, populate the form
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        store_id: item.store_id || "",
        stock: item.stock || 0,
      });

      // Set image preview if an existing URL is available
      if (item.image_url) {
        setImagePreview(item.image_url);
      }
    }
  }, [item]);

  useEffect(() => {
    // Load all stores for the dropdown
    const fetchStores = async () => {
      try {
        const storesData = await getAllStores();
        console.log("Stores loaded:", storesData);
        setStores(storesData);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  // If initialStoreId is provided after component mount, update the form data
  useEffect(() => {
    if (initialStoreId) {
      setFormData((prev) => ({ ...prev, store_id: initialStoreId }));
    }
  }, [initialStoreId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the file for form submission
    setImageFile(file);

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Clear any errors
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.store_id) {
      newErrors.store_id = "Store is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before validation:", formData);

    if (validate()) {
      // Format the data before submitting
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock || 0),
      };

      console.log("Submit data after validation:", submitData);

      // Create FormData object for file upload
      if (imageFile) {
        const formDataWithFile = new FormData();

        // Add all text fields
        Object.keys(submitData).forEach((key) => {
          formDataWithFile.append(key, submitData[key]);
        });

        // Add the image file
        formDataWithFile.append("image", imageFile);

        console.log(
          "Submitting form with file:",
          Array.from(formDataWithFile.entries())
        );
        onSubmit(formDataWithFile);
      } else {
        // Submit without file if no image was selected
        console.log("Submitting form without file:", submitData);
        onSubmit(submitData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Price"
        name="price"
        type="number"
        step="0.01"
        min="0"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        required
      />

      <Input
        label="Stock"
        name="stock"
        type="number"
        step="1"
        min="0"
        value={formData.stock}
        onChange={handleChange}
        error={errors.stock}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Store
        </label>
        <select
          name="store_id"
          value={formData.store_id}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
            ${errors.store_id ? "border-red-500" : "border-gray-300"}
          `}
          required
        >
          <option value="">Select a store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        {errors.store_id && (
          <p className="mt-1 text-sm text-red-500">{errors.store_id}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Item Image
        </label>
        <div className="flex flex-col space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />

          {imagePreview && (
            <div className="mt-2">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="h-32 w-auto object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;