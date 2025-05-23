import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Home.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../redux/cart/cartSlice";
import { addWish, removeWish } from "../../redux/wish2/wishSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const API = "https://66dfd7322fb67ac16f2740dd.mockapi.io/product";

function HomeCom() {
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [products, setProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const wishlistIds = useMemo(
    () => new Set(wishlist.map((item) => item.id)),
    [wishlist]
  );

  const handleToggleWish = (item) => {
    if (wishlistIds.has(item.id)) {
      dispatch(removeWish(item.id));
    } else {
      dispatch(addWish(item));
      setWishMessage("Товар добавлен в избранное");
      setTimeout(() => setWishMessage(""), 2000);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API);
        const data = await response.json();

        const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];

        const filtered = data.filter((item) => item.category === "food");

        const updatedProducts = filtered.map((item) => ({
          ...item,
          isLiked: likedItems.includes(item.id),
        }));

        setProducts(updatedProducts);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);

    if (itemExists) {
      setCartMessage("Товар уже в корзине");
      setTimeout(() => setCartMessage(""), 2000);
      return;
    }

    dispatch(addCart(item));
    setCartMessage("Товар добавлен в корзину");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -900, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 900, behavior: "smooth" });
    }
  };

  return (
    <div className="ali container">
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
      {wishMessage && <div className="wish-message">{wishMessage}</div>}

      <div className="main1-kros" ref={containerRef}>
        {products.length > 0 ? (
          products.map((item) => (
            <div key={item.id} className="kros1">
              <div className="mm">
                <Link to={`/obuv/${item.id}`} state={{ selectedProduct: item }}>
                  <img src={item.avatar} alt={item.name} />
                </Link>
              </div>
              <div className="main-top1">
                <p>{item.name}</p>
                <h5>{item.price}c</h5>
              </div>
              <div className="product-bottom">
                <button onClick={() => handleAddToCart(item)}>
                  Add to cart
                </button>
                <div
                  className="icon-like"
                  onClick={() => handleToggleWish(item)}
                >
                  {wishlistIds.has(item.id) ? (
                    <FaHeart color="red" size={24} />
                  ) : (
                    <FaRegHeart color="gray" size={24} />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Продукты табылган жок же жүктөлүүдө...</p>
        )}
      </div>

      <button className="scroll-arrow left-arrow" onClick={scrollLeft}>
        &#8592;
      </button>
      <button className="scroll-arrow right-arrow" onClick={scrollRight}>
        &#8594;
      </button>
    </div>
  );
}

export default HomeCom;
