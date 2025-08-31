import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const categories = [
  "All Products",
  "Breads",
  "Cakes",
  "Pastries",
  "Beverages",
  "Snacks",
];

const products = [
  { id: 1, name: "Sourdough Bread", price: 6.0, category: "Breads" },
  { id: 2, name: "Chocolate Cake", price: 25.0, category: "Cakes" },
  { id: 3, name: "Fruit Danish", price: 4.25, category: "Pastries" },
  { id: 4, name: "NY Cheesecake", price: 28.0, category: "Cakes" },
  { id: 5, name: "Blueberry Muffin", price: 3.75, category: "Pastries" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
  { id: 6, name: "Rye Bread", price: 5.5, category: "Breads" },
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Drawer variant="permanent" anchor="left">
        <Box width={200} p={2}>
          <Typography variant="h6">Sweet Dreams Bakery</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            {categories.map((cat) => (
              <ListItem
                button
                key={cat}
                selected={cat === selectedCategory}
                onClick={() => setSelectedCategory(cat)}
              >
                <ListItemText primary={cat} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Product Grid */}
      <Box flex={1} p={3} ml={25} marginRight={35} marginLeft={2}>
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Box
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                {/* Product Image */}
                <img
                  src={
                    product.defaultImage ||
                    "https://via.placeholder.com/200x140?text=Bakery+Item"
                  }
                  alt={product.name}
                  width={200}
                  height={140}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />

                {/* Product Name */}
                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {product.name}
                </Typography>

                {/* Product Price */}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Rs.{" "}
                  {new Intl.NumberFormat("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </Typography>

                {/* Add to Cart */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Cart Panel */}
      <Drawer variant="permanent" anchor="right">
        <Box width={300} p={2}>
          <Typography variant="h6">Current Order</Typography>
          <Divider sx={{ my: 1 }} />
          {cart.length === 0 ? (
            <Typography color="text.secondary">Cart is empty</Typography>
          ) : (
            <Box>
              {cart.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  justifyContent="space-between"
                  my={1}
                >
                  <Typography>
                    {item.name} (x{item.qty})
                  </Typography>
                  <Typography>
                    Rs. {(item.price * item.qty).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6">
                Total: Rs. {total.toFixed(2)}
              </Typography>

              {/* Checkout Form */}
              <Formik
                initialValues={{ customer: "" }}
                validationSchema={Yup.object({
                  customer: Yup.string().required("Customer name is required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  alert(
                    `Order placed for ${values.customer} - Rs. ${total.toFixed(
                      2
                    )}`
                  );
                  setCart([]);
                  resetForm();
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Field
                      name="customer"
                      placeholder="Customer Name"
                      style={{
                        width: "100%",
                        padding: "8px",
                        margin: "8px 0",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                    {errors.customer && touched.customer && (
                      <Typography color="error" variant="body2">
                        {errors.customer}
                      </Typography>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={cart.length === 0}
                    >
                      Checkout
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Dashboard;
