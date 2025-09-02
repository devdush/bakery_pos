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
  BarChart,
  Bar,
} from "recharts";
import { ShoppingCart, AttachMoney, Store, People } from "@mui/icons-material";
import {
  getDayByDayCategoryWiseSales,
  getSalesData,
  getTodayDetails,
  getWeeklySales,
} from "../../Services/getOrders";

const AdminDashboard = () => {
  // Example stats
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [todayDetails, setTodayDetails] = useState([]);
  const [dayByDayCategoryWiseSales, setDayByDayCategoryWiseSales] = useState(
    []
  );
  useEffect(() => {
    // Fetch sales data from API or other source
    const fetchSalesData = async () => {
      const response = await getWeeklySales();
      const categoryResponse = await getSalesData();
      const todayResponse = await getTodayDetails();
      const dayByDayResponse = await getDayByDayCategoryWiseSales();
      const formattedData = dayByDayResponse.data.map((item) => ({
        ...item,
        date: new Date(item.date).getDate(), // only show day number (1–31)
      }));
      setDayByDayCategoryWiseSales(formattedData);
      setCategoryData(categoryResponse.data);
      setSalesData(response.data);
      setTodayDetails(todayResponse.data[0]);
    };

    fetchSalesData();
  }, []);

  const stats = [
    {
      title: "Total Sales",
      value: todayDetails.totalSales,
      icon: <AttachMoney fontSize="large" sx={{ color: "green" }} />,
    },
    {
      title: "Orders Today",
      value: todayDetails.totalOrders,
      icon: <ShoppingCart fontSize="large" sx={{ color: "blue" }} />,
    },
    {
      title: "Products",
      value: todayDetails.totalItems,
      icon: <Store fontSize="large" sx={{ color: "orange" }} />,
    },
    {
      title: "Cashiers",
      value: "2",
      icon: <People fontSize="large" sx={{ color: "purple" }} />,
    },
  ];

  // Example category data

  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE"];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Today’s Overview
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Monthly Category-wise Sales
            </Typography>

            {/* Scrollable horizontally */}
            <Box sx={{ width: "100%", height: "90%", overflowX: "auto" }}>
              <BarChart
                width={dayByDayCategoryWiseSales.length * 100} // ~100px per day
                height={350}
                data={dayByDayCategoryWiseSales}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis /> {/* stays fixed, no scroll */}
                <Tooltip />
                <Legend />
                <Bar dataKey="Bread" fill="#82ca9d" />
                <Bar dataKey="Cake" fill="#8884d8" />
                <Bar dataKey="Pastries" fill="#ffc658" />
                <Bar dataKey="Beverages" fill="#8dd1e1" />
                <Bar dataKey="Savory Snacks" fill="#d0ed57" />
                <Bar dataKey="Sandwiches & Rolls" fill="#a4de6c" />
              </BarChart>
            </Box>
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
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
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
