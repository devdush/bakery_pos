import {
  Box,
  Divider,
  MenuItem,
  Select,
  Typography,
  Modal,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getItemTypes } from "../../Services/getItemTypes";
import { getKOTData } from "../../Services/getKOT"; // make sure you have update service
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { updateKOT } from "../../Services/updateKot";

const KOT = () => {
  const [itemType, setItemType] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchKOTData = async () => {
      const result = await getItemTypes(itemType);
      setItemType(result.data.data);
    };
    fetchKOTData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!selectedItemType) return;
      const response = await getKOTData(selectedItemType);
      setFilteredData(response.data.data);
    };
    fetchFilteredData();
  }, [selectedItemType]);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleStatusChange = async () => {
    try {

      const response = await updateKOT(selectedRow._id, {
        items: selectedRow.items,
        status: "ready",
        totalAmount: selectedRow.totalAmount,
      });
      if (response.data.success) {
        toast.success("Status updated to Ready ✅");
        // refresh table data
        setFilteredData((prev) =>
          prev.map((row) =>
            row._id === selectedRow._id ? { ...row, status: "ready" } : row
          )
        );
        setOpen(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  const columns = [
    {
      field: "createdAt",
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
        return (
          params?.map((item) => item.productId.itemName).join(", ") || "N/A"
        );
      },
    },
    {
      field: "stuartInfo",
      headerName: "Stuart Name",
      flex: 2,
      valueGetter: (params) => params.name || "N/A",
    },
    { field: "status", headerName: "Status", flex: 2 },
  ];

  return (
    <Box>
      <Typography variant="h4">KOT Screen</Typography>
      <Divider />
      <Select
        label="Item Type"
        sx={{ minWidth: 200, marginTop: 2 }}
        value={selectedItemType}
        onChange={(e) => setSelectedItemType(e.target.value)}
      >
        {itemType?.map((type) => (
          <MenuItem key={type._id} value={type._id}>
            {type.itemTypeName}
          </MenuItem>
        ))}
      </Select>

      <Box height="100vh" sx={{ overflow: "scroll", mt: 2 }}>
        <DataGrid
          rows={filteredData}
          getRowId={(row) => row._id}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            maxWidth: 600,
            width: "95%",
            mx: "auto",
            mt: 5,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          }}
        >
          {selectedRow && (
            <>
              <Typography variant="h6" gutterBottom>
                KOT Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography>
                <b>Stuart:</b> {selectedRow.stuartInfo?.name}
              </Typography>
              <Typography>
                <b>Status:</b> {selectedRow.status}
              </Typography>
              <Typography>
                <b>Date:</b> {new Date(selectedRow.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                <b>Total:</b> Rs. {selectedRow.totalAmount}
              </Typography>

              <Typography sx={{ mt: 2, fontWeight: "bold" }}>Items:</Typography>
              {selectedRow.items?.map((item, idx) => (
                <Typography key={idx}>
                  {item.productId?.itemName} - {item.quantity}
                </Typography>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 1,
                }}
              >
                <Button onClick={handleClose} variant="outlined" color="error">
                  Close
                </Button>
                <Button
                  onClick={handleStatusChange}
                  variant="contained"
                  color="success"
                  disabled={selectedRow.status === "ready"}
                >
                  Mark Ready
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default KOT;
