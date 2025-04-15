import { useState , createContext} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const cartContext = createContext([]);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart"))||[]);
console.log("cart", cart);

  return (
    <cartContext.Provider value={{ cart, setCart }}>
      {children}
    </cartContext.Provider>
  );
};

export default CartProvider;
