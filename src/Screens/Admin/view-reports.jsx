import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getOrders } from "../../Services/getOrders";
import { toast } from "react-toastify";
const ViewReports = () => {
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getOrders();
        console.log("Orders response:", response.data);
        if (response?.data) {
          setFilteredData(response.data);
        } else {
          toast.error("No data found");
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);
  const columns = [
    {
      field: "orderDate",
      headerName: "Date",
      flex: 3,
      valueFormatter: (params) => {
        const date = new Date(params);
        return date.toLocaleDateString();
      },
    },
    {
      field: "items",
      headerName: "Items",
      flex: 4,
      valueGetter: (params) => {
        return params?.map(item => item.productId.itemName).join(", ") || "N/A";
      },
    },
    {
      field: "cashierInfo",
      headerName: "Cashier Name",
      flex: 2,
      valueGetter: (params) => {
        return params.name || "N/A";
      },
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 2,
      valueFormatter: (params) => `Rs.${params.toFixed(2)}`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 2
    },
  ];
  return (
    <Box height="100vh" sx={{ overflow: "scroll" }}>
      <DataGrid
        rows={filteredData}
        getRowId={(row) => row._id}
        columns={columns}
      />
    </Box>
  );
};

export default ViewReports;
