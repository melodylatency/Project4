const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  ); // 0 is acc default value

  // Calculate shipping price (if order is > 120$, free, else: 12$)
  state.shippingPrice = addDecimals(state.itemsPrice > 120 ? 0 : 12);

  // Calculate tax price
  state.taxPrice = addDecimals(Number((state.itemsPrice * 0.15).toFixed(2)));

  // Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save to local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
