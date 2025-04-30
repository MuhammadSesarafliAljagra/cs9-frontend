import { Link } from "react-router-dom";

const StoreCard = ({ store }) => {
  return (
    <Link
      to={`/stores/${store.id}`}
      className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Store header/image section */}
      <div className="h-32 bg-indigo-700 flex items-center justify-center">
        {store.imageUrl ? (
          <img
            src={store.imageUrl}
            alt={store.name}
            className="object-cover h-full w-full"
          />
        ) : (
          <span className="text-white text-xl font-bold">{store.name}</span>
        )}
      </div>

      {/* Store details */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{store.name}</h3>
        <p className="text-gray-500 text-sm mb-4">
          {store.description?.length > 100
            ? `${store.description.substring(0, 100)}...`
            : store.description || "No description available"}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{store.itemCount || 0} items</span>
          <span className="text-indigo-600 font-medium">View store →</span>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;