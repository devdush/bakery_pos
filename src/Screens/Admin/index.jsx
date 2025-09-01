import React, { use, useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, AttachMoney, Store, People } from "@mui/icons-material";
import { getSalesData, getWeeklySales } from "../../Services/getOrders";

const AdminDashboard = () => {
  // Example stats
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    // Fetch sales data from API or other source
    const fetchSalesData = async () => {
      const response = await getWeeklySales();
      const categoryResponse = await getSalesData();
      setCategoryData(categoryResponse.data);
      setSalesData(response.data);
    };

    fetchSalesData();
  }, []);

  const stats = [
    {
      title: "Total Sales",
      value: "Rs. 120,500",
      icon: <AttachMoney fontSize="large" sx={{ color: "green" }} />,
    },
    {
      title: "Orders Today",
      value: "56",
      icon: <ShoppingCart fontSize="large" sx={{ color: "blue" }} />,
    },
    {
      title: "Products",
      value: "120",
      icon: <Store fontSize="large" sx={{ color: "orange" }} />,
    },
    {
      title: "Cashiers",
      value: "8",
      icon: <People fontSize="large" sx={{ color: "purple" }} />,
    },
  ];

  // Example category data

  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE"];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stat Circles */}
      <Grid
        sx={{ display: "flex", justifyContent: "center", gap: "50px", mb: 4 }}
      >
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: "50%",
                height: 180,
                width: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                margin: "0 auto",
              }}
            >
              {stat.icon}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {stat.title}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Weekly Sales
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
