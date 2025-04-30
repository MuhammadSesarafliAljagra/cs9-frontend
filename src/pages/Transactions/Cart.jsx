import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import TransactionItem from "../../components/transactions/TransactionItem";
import Button from "../../components/common/Button";

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link to="/items">
          <Button>Browse Items</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="divide-y">
        {cart.map((item) => (
          <TransactionItem
            key={item.id}
            item={item}
            isInCart={true}
            onQuantityChange={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/items">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
          <Link to="/checkout">
            <Button>Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
