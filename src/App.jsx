import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import ItemsList from "./pages/Items/ItemList";
import ItemDetails from "./pages/Items/ItemDetails";
import AddItem from "./pages/Items/AddItem"; // Import the new component
// import EditItem from "./pages/Items/EditItem"; // Import if you have this
import StoresList from "./pages/Stores/StoresList";
import StoreDetails from "./pages/Stores/StoreDetails";
import TransactionHistory from "./pages/Transactions/TransactionHistory";
import Profile from "./pages/User/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items" element={<ItemsList />} />
              <Route path="/items/add" element={<AddItem />} />{" "}
              {/* Add this line BEFORE the :id route */}
              {/* <Route path="/items/edit/:id" element={<EditItem />} />{" "}
              If you have edit functionality */}
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/stores" element={<StoresList />} />
              <Route path="/stores/:id" element={<StoreDetails />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
