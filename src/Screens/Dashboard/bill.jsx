import React, { forwardRef } from "react";

const Bill = forwardRef(({ cart, total, paymentMethod }, ref) => {
  const date = new Date().toLocaleString();

  return (
    <div
      ref={ref}
      style={{
        padding: "10px",
        width: "250px",
        fontFamily: "monospace",
      }}
    >
      <h3 style={{ textAlign: "center", margin: "4px 0" }}>
        Sweet Dreams Bakery
      </h3>
      <p style={{ textAlign: "center", fontSize: "12px", margin: 0 }}>{date}</p>
      <hr />

      {cart.map((item) => (
        <div
          key={item._id}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>
            {item.itemName} x{item.qty}
          </span>
          <span>Rs.{(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <hr />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span>Total</span>
        <span>Rs.{total.toFixed(2)}</span>
      </div>
      <p style={{ marginTop: "5px" }}>Payment: {paymentMethod}</p>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Thank you! Come again.
      </p>
    </div>
  );
});

export default Bill;
