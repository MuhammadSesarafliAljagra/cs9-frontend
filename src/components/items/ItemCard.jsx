import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import Button from "../common/Button";

const ItemCard = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...item, quantity: 1 });
  };

  return (
    <div
      className={`relative border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Image with overlay for out of stock items */}
      <div className="relative h-52 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex items-center justify-center h-full w-full ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-16 w-16 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Stock badge - show if stock is low */}
        {item.stock !== undefined && item.stock <= 5 && item.stock > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Only {item.stock} left
          </div>
        )}

        {/* Out of stock overlay */}
        {item.stock !== undefined && item.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Price tag */}
        <div className="absolute bottom-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-tr-xl font-bold">
          Rp. {parseFloat(item.price).toFixed(2)}
        </div>
      </div>

      <div className="p-4">
        {/* Store name if available */}
        {item.store_name && (
          <div
            className={`text-xs mb-1 ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            {item.store_name}
          </div>
        )}

        {/* Item name */}
        <h3
          className={`text-lg font-medium mb-1 line-clamp-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {item.name}
        </h3>

        {/* Stock information instead of description */}
        <p
          className={`text-sm mb-3 flex items-center h-10 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 mr-1 ${
              item.stock > 0
                ? item.stock <= 5
                  ? "text-yellow-500"
                  : "text-green-500"
                : "text-red-500"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m-8-4l8 4m8-8l-8 4-8-4"
            />
          </svg>
          <span>
            {item.stock !== undefined
              ? item.stock > 0
                ? `In Stock: ${item.stock} units`
                : "Out of Stock"
              : "Stock unavailable"}
          </span>
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/items/${item.id}`}
            className={`text-sm font-medium flex items-center ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
          >
            Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Button
            variant="primary"
            className="py-1 px-3 text-sm rounded-full"
            onClick={handleAddToCart}
            disabled={item.stock !== undefined && item.stock === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;