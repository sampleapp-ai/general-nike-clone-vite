import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import StripeCheckout from "./pages/StripeCheckout";
import CheckoutSuccess from "./pages/CheckoutSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/stripe" element={<StripeCheckout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
    </Routes>
  );
}

export default App;
