import { useState } from "react";

const TransactionItem = ({
  item,
  isInCart = false,
  onQuantityChange,
  onRemove,
}) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center py-4 border-b">
      {/* Item image */}
      <div className="w-16 h-16 bg-gray-200 mr-4 flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Item details */}
      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-gray-500 text-sm">
          ${parseFloat(item.price).toFixed(2)} per item
        </p>
      </div>

      {/* Quantity and actions */}
      <div className="flex items-center space-x-4">
        {isInCart ? (
          <>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 py-1 px-2 border rounded-md"
            />
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-gray-700">
            {item.quantity} × ${parseFloat(item.price).toFixed(2)}
          </div>
        )}

        <div className="font-bold text-gray-800 min-w-[80px] text-right">
          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;