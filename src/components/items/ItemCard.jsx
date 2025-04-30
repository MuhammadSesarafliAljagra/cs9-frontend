import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import Button from "../common/Button";

const ItemCard = ({ item }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image placeholder */}
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="object-cover h-full w-full"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-2">
          {item.description?.length > 60
            ? `${item.description.substring(0, 60)}...`
            : item.description || "No description available"}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">
            Rp. {parseFloat(item.price).toFixed(2)}
          </span>
          <div className="flex space-x-2">
            <Link
              to={`/items/${item.id}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Details
            </Link>
            <Button
              variant="outline"
              className="py-1 px-3 text-sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;