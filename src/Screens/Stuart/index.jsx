import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Modal,
  Divider,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Drawer,
  MenuItem,
  Select,
} from "@mui/material";
import TableBarIcon from "@mui/icons-material/TableBar"; // Table icon
import { getTables } from "../../Services/getTable";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getCategories } from "../../Services/getCategories";
import { getProducts } from "../../Services/getProducts";
import { createOrder } from "../../Services/createOrder";
import { toast } from "react-toastify";
import { createStuartOrder } from "../../Services/createStuartOrder";
import { createKot } from "../../Services/createKot";
import { updateTable } from "../../Services/updateTable";
import { getSelectedTableOrderDetails } from "../../Services/getStuartOrders";
import { DataGrid } from "@mui/x-data-grid";

const StuartDashboard = () => {
  const [tables, setTables] = useState([]);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openOrderedModal, setOpenOrderedModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState();
  const [time, setTime] = useState();
  const [selectedTableOrderDetails, setSelectedTableOrderDetails] = useState();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTables();
        console.log("Tables Data:", response);
        setTables(response.data.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchData();
  }, []);

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
            sx={{
              bgcolor:
                cat._id === selectedCategory ? "#a7fff888" : "transparent",
              cursor: "pointer",
            }}
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
  const handleOpen = async (table) => {
    setSelectedTable(table);
    if (table.status === "Available") {
      setOpenOrderModal(true);
    } else {
      const response = await getSelectedTableOrderDetails(table._id);
      console.log("Selected Table Order Details:", response.data.data);
      setSelectedTableOrderDetails(response.data.data);
      setOpenOrderedModal(true);
    }
  };
  const handleClose = () => {
    setOpenOrderModal(false);
    setOpenOrderedModal(false);
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "success";
      case "Occupied":
        return "error";
      default:
        return "default";
    }
  };
  const columns = [
    { field: "itemName", headerName: "Product Name", width: 220 },
    { field: "price", headerName: "Price (LKR)", width: 130 },

    {
      field: "quantity",
      headerName: "Ordered Qty",
      width: 130,
    },
    {
      field: "total",
      headerName: "Total (LKR)",
      width: 150,
      valueGetter: (params) => params?.row?.price * params?.row?.quantity,
    },
  ];

  const rows = selectedTableOrderDetails?.productsInfo.map((product, index) => {
    const orderedItem = selectedTableOrderDetails?.items.find(
      (item) => item.productId === product._id
    );
    return {
      id: product._id,
      //productImage: product.productImage,
      itemName: product.itemName,
      // price: product.price,
      //availableQuantity: product.availableQuantity,
      quantity: orderedItem ? orderedItem.quantity : 0,
    };
  });
  const handleCompleteOrder = async () => {
    const obj = {
      cashierId: localStorage.getItem("cashierId"),
      paymentMethod: paymentMethod,
      items: selectedTableOrderDetails?.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: selectedTableOrderDetails?.totalAmount,
    };
    try {
      const response = await createOrder(obj);

      toast.success("Order created successfully!");
      const tableResponse = await updateTable(selectedTable._id, {
        status: "Available",
      });

      toast.success("Table updated successfully!");
      setTables((prev) =>
        prev.map((tbl) =>
          tbl._id === selectedTable._id ? { ...tbl, status: "Available" } : tbl
        )
      );

      handleClose();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error creating order.");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        bgcolor: "#f9fafb",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          bgcolor: "#1976d2",
          p: 2,
          boxShadow: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}
        >
          🍽️ Stuart Restaurant Dashboard
        </Typography>
      </Box>

      {/* Table Visualization */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
        >
          Table Visualization
        </Typography>

        <Grid container spacing={3}>
          {tables.map((table, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table._id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: "all 0.3s ease-in-out",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 8,
                  },
                  cursor: "pointer",
                  height: 200,
                }}
                onClick={() => handleOpen(table)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    py: 3,
                  }}
                >
                  {/* Table Icon */}
                  <TableBarIcon
                    sx={{
                      fontSize: 50,
                      color:
                        table.status === "Available"
                          ? "#2e7d32"
                          : table.status === "Occupied"
                            ? "#d32f2f"
                            : "#ed6c02",
                      mb: 1,
                    }}
                  />

                  {/* Table Number */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "#1976d2",
                    }}
                  >
                    Table {index + 1}
                  </Typography>

                  {/* Table Status */}
                  <Chip
                    label={table.status}
                    color={getStatusColor(table.status)}
                    sx={{
                      mb: 1,
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      px: 1.5,
                    }}
                  />

                  {/* Time */}
                  {table.status === "Occupied" && table.occupiedAt && (
                    <Typography variant="body2" color="text.secondary">
                      {`Occupied for: ${Math.floor(
                        (Date.now() - new Date(table.occupiedAt)) / 60000
                      )} min`}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Modal open={openOrderModal} onClose={handleClose}>
        <Box
          sx={{
            maxWidth: 1300,
            width: "95%",
            mx: "auto",
            mt: 5,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Table Details
            </Typography>
            <Button
              onClick={handleClose}
              color="error"
              variant="outlined"
              size="small"
            >
              Close
            </Button>
          </Box>
          <Divider />

          {/* Modal Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              flex: 1,
              mt: 2,
              overflow: "hidden",
            }}
          >
            {/* Sidebar (Categories) */}
            <Box
              sx={{
                width: isMobile ? "100%" : 220,
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",

                p: 1,
                overflowY: "auto",
                maxHeight: isMobile ? "auto" : "75vh",
              }}
            >
              {drawerContent}
            </Box>

            {/* Product List */}
            <Box
              sx={{
                flex: 3,
                overflowY: "auto",
                maxHeight: "75vh",
                p: 1,
              }}
            >
              <Grid container spacing={2}>
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
                        boxShadow: 1,
                        backgroundColor: "#fff",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      <img
                        src={
                          product.productImage ||
                          "https://via.placeholder.com/200x140?text=Bakery+Item"
                        }
                        alt={product.itemName}
                        width={180}
                        height={120}
                        style={{ objectFit: "contain", borderRadius: "4px" }}
                      />

                      <Typography
                        sx={{ mt: 1, fontWeight: 500, textAlign: "center" }}
                      >
                        {product.itemName}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
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
                          color:
                            product.availableQuantity > 0 ? "#40e945" : "red",
                        }}
                      >
                        {product.availableQuantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </Typography>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.availableQuantity <= 0}
                        sx={{
                          mt: 1,
                          bgcolor: "#1976d2",
                          "&:hover": { bgcolor: "#125ea8" },
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Cart / Right Panel */}
            <Box
              sx={{
                width: isMobile ? "100%" : 300,
                borderLeft: isMobile ? "none" : "1px solid #e0e0e0",
                p: 2,
                overflowY: "auto",
                maxHeight: "75vh",
              }}
            >
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

                  <Formik
                    initialValues={{ customer: "" }}
                    onSubmit={async (values, { resetForm }) => {
                      const stuartId = localStorage.getItem("cashierId");

                      // Collect all itemTypeIds from cart
                      const itemTypes = cart.map((item) => item.itemTypeId);
                      const uniqueItemTypes = [...new Set(itemTypes)];

                      // Stuart Order Object
                      const stuartOrderObj = {
                        stuartId: stuartId,
                        items: cart.map((item) => ({
                          productId: item._id,
                          quantity: item.qty,
                        })),
                        totalAmount: total,
                        tableId: selectedTable._id,
                        status: "pending",
                      };

                      try {
                        // 1. Create the Stuart Order
                        const response =
                          await createStuartOrder(stuartOrderObj);
                        const createdStuartOrderId = response.data.data._id;

                        if (response.data.success) {
                          try {
                            // 2. Group products by itemTypeId
                            const groupedProducts = cart.reduce(
                              (acc, product) => {
                                if (!acc[product.itemTypeId]) {
                                  acc[product.itemTypeId] = [];
                                }
                                acc[product.itemTypeId].push(product);
                                return acc;
                              },
                              {}
                            );

                            console.log("Grouped Products:", groupedProducts);

                            // 3. Prepare KOT requests per item type
                            const kotRequests = Object.keys(
                              groupedProducts
                            ).map((itemTypeId) => {
                              const kotPayload = {
                                tableId: selectedTable._id,
                                stuartOrderId: createdStuartOrderId,
                                status: "pending", // Default status
                                totalAmount: groupedProducts[itemTypeId].reduce(
                                  (sum, p) => sum + p.qty * p.price,
                                  0
                                ), // calculate total amount per item type
                                items: groupedProducts[itemTypeId].map((p) => ({
                                  productId: p._id,
                                  quantity: p.qty,
                                })),
                              };

                              // Send request for each item type
                              return createKot(kotPayload); // <-- API function for KOT
                            });

                            // 4. Send all KOT requests in parallel
                            const kotResponses = await Promise.all(kotRequests);
                            if (kotResponses.every((res) => res.data.success)) {
                              console.log(
                                "KOT Orders Created:",
                                kotResponses.map((res) => res.data)
                              );
                              toast.success(
                                "Stuart order and KOTs created successfully!"
                              );
                              resetForm();
                              setCart([]);
                              const response = await updateTable(
                                selectedTable._id,
                                { status: "Occupied", occupiedAt: new Date() }
                              );
                              console.log("Table updated:", response.data);
                              setTables((prevTables) =>
                                prevTables.map((t) =>
                                  t._id === selectedTable._id
                                    ? { ...t, status: "Occupied" }
                                    : t
                                )
                              );
                              setTime(Date.now());
                              handleClose();
                            }

                            // 5. Show success & reset form
                          } catch (error) {
                            console.error("Error creating KOT orders:", error);
                            toast.error("Failed to create KOT orders.");
                          }
                        }
                      } catch (error) {
                        console.error("Error creating Stuart order:", error);
                        toast.error("Failed to create Stuart order.");
                      }
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
                          Create Order
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal open={openOrderedModal} onClose={handleClose}>
        <Box
          sx={{
            maxWidth: 1300,
            width: "95%",
            mx: "auto",
            mt: 5,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflow: "scroll",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Table Order Details
            </Typography>
            <Chip
              label={selectedTableOrderDetails?.status.toUpperCase()}
              color={
                selectedTableOrderDetails?.status === "pending"
                  ? "warning"
                  : selectedTableOrderDetails?.status === "completed"
                    ? "success"
                    : "error"
              }
              sx={{ fontWeight: "bold" }}
            />
            <Button
              onClick={handleClose}
              color="error"
              variant="outlined"
              size="small"
            >
              Close
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1">
                {selectedTableOrderDetails?.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Table
              </Typography>
              <Typography variant="body1">
                {selectedTableOrderDetails?.tableInfo?._id || "N/A"}{" "}
                <Chip
                  label={
                    selectedTableOrderDetails?.tableInfo?.status || "Unknown"
                  }
                  size="small"
                  color={
                    selectedTableOrderDetails?.tableInfo?.status === "Occupied"
                      ? "success"
                      : "default"
                  }
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Stuart
              </Typography>
              <Typography variant="body1">
                {selectedTableOrderDetails?.stuartInfo?.name || "N/A"}
              </Typography>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{
              mt: 1,
              mb: 2,
              textAlign: "right",
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Total Amount: LKR {selectedTableOrderDetails?.totalAmount}
          </Typography>

          <Box sx={{ flex: 1 }}>
            <DataGrid
              rows={rows ? rows : []}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              disableSelectionOnClick
              autoHeight
              sx={{
                borderRadius: 2,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Payment Method
            </Typography>
            <Select
              sx={{ mt: 2, mb: 2, mr: 2, minWidth: 220 }}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="mobile">Mobile Payment</MenuItem>
            </Select>
          </Box>
          <Button
            onClick={handleCompleteOrder}
            color="primary"
            variant="contained"
          >
            Complete Order
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default StuartDashboard;
