import React, { use, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { createCategory } from "../../Services/createCategory";
import { getCategories } from "../../Services/getCategories";
import { createProduct } from "../../Services/createProduct";

const CreateProduct = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (selectedFile) {
      console.log("selectedFile updated:", selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response?.data) {
          setCategories(response?.data?.data);
          console.log("Fetched categories:", categories);
        } else {
          toast.error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);
  const initialValues = {
    productName: "",
    price: "",
    availableQuantity: "",
    categoryId: "",
    productImage: "",
  };

  const validationSchema = Yup.object({
    productName: Yup.string().required("Product name is required"),
    price: Yup.number().required("Price is required"),
    availableQuantity: Yup.number().required("Quantity is required"),
    categoryId: Yup.string().required("Category ID is required"),
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 2) {
        setError("File size exceeds 2MB. Please upload a smaller file.");
        setSelectedFile(null);
        return;
      }
      console.log(file);
      const img = new Image();
      img.onload = () => {
        if (img.width !== 400 || img.height !== 400) {
          setError(
            "Invalid image dimensions. Please upload an image of 400 x 400 pixels."
          );
          setSelectedFile(null);
        } else {
          setError("");
          setSelectedFile(file);
        }
        console.log("Image dimensions are valid.", selectedFile);
      };
      img.onerror = () => {
        setError("Invalid image file. Please upload a valid image.");
        setSelectedFile(null);
      };
      img.src = URL.createObjectURL(file);
    }
  };
  return (
    <Box
      sx={{
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        display: isMobile ? "block" : "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create Category
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log("Form values:", values);
          try {
            const formData = new FormData();
            formData.append("itemName", values.productName);
            formData.append("price", values.price.toString());
            formData.append(
              "availableQuantity",
              values.availableQuantity.toString()
            );
            formData.append("categoryId", values.categoryId);
            formData.append("productImage", selectedFile);
            const response = await createProduct(formData);
            console.log("Form Data:", response);

            if (response?.data) {
              toast.success("Product created successfully");
            } else {
              toast.error(response.data.message);
            }
          } catch (err) {
            console.error("Product creation error:", err);
            toast.error("Product creation failed. Please try again.");
          }
        }}
      >
        <Form>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              width: isMobile ? "100%" : "80%",
            }}
          >
            <Grid item xs={12} sm={6}>
              <Field
                name="productName"
                as={TextField}
                label="Product Name"
                fullWidth
              />
              <ErrorMessage
                style={{ color: "red" }}
                name="productName"
                component="div"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field
                name="price"
                as={TextField}
                type="number"
                label="Price"
                fullWidth
              />
              <ErrorMessage
                style={{ color: "red" }}
                name="price"
                component="div"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field
                name="availableQuantity"
                as={TextField}
                type="number"
                label="Available Quantity"
                fullWidth
              />
              <ErrorMessage
                style={{ color: "red" }}
                name="availableQuantity"
                component="div"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Select Category</InputLabel>
                <Field name="categoryId" as={Select} label="Category" fullWidth>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <ErrorMessage
                style={{ color: "red" }}
                name="categoryId"
                component="div"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  textAlign: "left",
                }}
              >
                <Typography>Product Image</Typography>
                <input type="file" onChange={handleFileInput} />
                {error && <p style={{ color: "red" }}>{error}</p>}
                {imageUrl && (
                  <div>
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      style={{ width: "200px" }}
                    />
                  </div>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                color="primary"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default CreateProduct;
