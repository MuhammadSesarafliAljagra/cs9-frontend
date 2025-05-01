import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import ItemsList from "./pages/Items/ItemList";
import ItemDetails from "./pages/Items/ItemDetails";
import AddItem from "./pages/Items/AddItem";
// import EditItem from "./pages/Items/EditItem"; // Add this component
import StoresList from "./pages/Stores/StoresList";
import StoreDetails from "./pages/Stores/StoreDetails";
// import AddStore from "./pages/Stores/AddStore"; // Add this component
// import EditStore from "./pages/Stores/EditStore"; // Add this component
import Cart from "./pages/Transactions/Cart";
import Checkout from "./pages/Transactions/Checkout";
import TransactionHistory from "./pages/Transactions/TransactionHistory";
import Profile from "./pages/User/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Footer from "./components/common/Footer";
import PageContainer from "./components/layout/PageContainer"; // Create this component
import TopUp from "./pages/User/TopUp";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/items" element={<ItemsList />} />
                <Route path="/items/add" element={<AddItem />} />
                {/* <Route path="/items/edit/:id" element={<EditItem />} /> */}
                <Route path="/items/:id" element={<ItemDetails />} />
                <Route path="/stores" element={<StoresList />} />
                {/* <Route path="/stores/add" element={<AddStore />} />
                <Route path="/stores/edit/:id" element={<EditStore />} /> */}
                <Route path="/stores/:id" element={<StoreDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/topup" element={<TopUp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
