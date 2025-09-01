import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useMediaQuery,
  Grid,
  ListItemAvatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getCategories } from "../../Services/getCategories";
import { getProducts } from "../../Services/getProducts";
import { createOrder } from "../../Services/createOrder";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Bill from "./bill";

const TestComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState();
  const [lastPaymentMethod, setLastPaymentMethod] = useState("");

  const billRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: billRef, // 👈 instead of content: () => ref.current
    documentTitle: "Bakery Bill",
    onAfterPrint: () => setCart([]),
  });
  useEffect(() => {
    console.log("Bill ref:", billRef.current);
  }, [billRef.current]);
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      const productsData = await getProducts();
      const user = localStorage.getItem("role");
      console.log("User Role:", user);
      setCategories(response.data.data);
      setProducts(productsData.data.data);
      console.log(productsData.data.data);
    };

    fetchCategories();
  }, []);

  const handleAddToCart = (product) => {
    if (product.availableQuantity <= 0) return; // Prevent adding if out of stock

    setCart((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) {
        // Only add if availableQuantity allows
        if (product.availableQuantity - exist.qty <= 0) return prev;
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === product._id
          ? { ...p, availableQuantity: p.availableQuantity - 1 }
          : p
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  const drawerContent = (
    <Box p={2} width={220}>
      <Typography variant="h6">Sweet Dreams Bakery</Typography>
      <Divider sx={{ my: 1 }} />
      <List>
        {categories?.map((cat) => (
          <ListItem
            button
            key={cat._id}
            selected={cat._id === selectedCategory}
            onClick={() => {
              setSelectedCategory(cat._id);
              console.log(selectedCategory);
              if (isMobile) setMobileOpen(false); // close drawer on mobile
            }}
          >
            <ListItemText primary={cat.categoryName} />
            <ListItemAvatar>
              <img
                src={cat.categoryImage || "https://via.placeholder.com/40"}
                alt={cat.categoryName}
                style={{ width: 50, height: 50 }}
              />
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const handleRemoveFromCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist.qty === 1) {
        // if only 1 qty, remove the item completely
        return prev.filter((item) => item._id !== product._id);
      } else {
        // otherwise decrease qty
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty - 1 } : item
        );
      }
    });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100vh",
          flex: 1,
        }}
      >
        {/* Sidebar */}
        {!isMobile ? (
          <Drawer variant="permanent" open anchor="left">
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            anchor="left"
            ModalProps={{ keepMounted: true }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 3, p: 2, justifyContent: "center" }}>
        <Grid container spacing={2} sx={{}}>
          {filteredProducts?.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
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
                <img
                  src={
                    product.productImage ||
                    "https://via.placeholder.com/200x140?text=Bakery+Item"
                  }
                  alt={product.itemName}
                  width={200}
                  height={140}
                  style={{ objectFit: "contain", borderRadius: "4px" }}
                />

                <Typography
                  sx={{ mt: 1, fontWeight: 500, textAlign: "center" }}
                >
                  {product.itemName}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Rs.{" "}
                  {new Intl.NumberFormat("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: 500,
                    textAlign: "center",
                    color: product.availableQuantity > 0 ? "#40e945" : "red",
                  }}
                >
                  {product.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                </Typography>

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

      {/* Cart / Right Panel */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          ...(isMobile && { width: "100%" }),
        }}
      >
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
                    key={item._id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    my={1}
                  >
                    <Box>
                      <Typography>{item.itemName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rs. {(item.price * item.qty).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRemoveFromCart(item)}
                      >
                        -
                      </Button>
                      <Typography>{item.qty}</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAddToCart(item)}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 1 }} />
                <Typography variant="h6">
                  Total: Rs. {total.toFixed(2)}
                </Typography>

                {/* Checkout Form */}
                <Formik
                  initialValues={{ customer: "", paymentMethod: "" }}
                  validationSchema={Yup.object({
                    paymentMethod: Yup.string().required("Required"),
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    const cashierId = localStorage.getItem("cashierId");
                    const obj = {
                      cashierId: cashierId,
                      items: cart.map((item) => ({
                        productId: item._id,
                        quantity: item.qty,
                      })),
                      totalAmount: total,
                      paymentMethod: values.paymentMethod,
                    };
                    try {
                      const response = await createOrder(obj);
                      setLastPaymentMethod(values.paymentMethod);
                      toast.success("Order created successfully!");
                      handlePrint();
                    } catch (error) {
                      console.error("Error creating order:", error);
                      toast.error("Error creating order.");
                    }

                    resetForm();
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Field
                        name="customer"
                        placeholder="Phone Number"
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
                      <Field
                        name="paymentMethod"
                        as="select"
                        style={{
                          width: "100%",
                          padding: "8px",
                          margin: "8px 0",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                      </Field>
                      {errors.paymentMethod && touched.paymentMethod && (
                        <Typography color="error" variant="body2">
                          {errors.paymentMethod}
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
      <div style={{ position: "absolute", left: "-9999px" }}>
        <Bill
          ref={billRef}
          cart={cart}
          total={total}
          paymentMethod={lastPaymentMethod}
        />
      </div>
    </Box>
  );
};

export default TestComponent;
