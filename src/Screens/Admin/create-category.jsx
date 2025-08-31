import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { createCategory } from "../../Services/createCategory";

const CreateCategory = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (selectedFile) {
      console.log("selectedFile updated:", selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);

  const initialValues = {
    categoryName: "",
    image: "",
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category name is required"),
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
            "Invalid image dimensions. Please upload an image of 600 x 600 pixels."
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
        maxWidth: 800,
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
          try {
            const formData = new FormData();
            formData.append("categoryName", values.categoryName);
            formData.append("categoryImage", selectedFile);

            const response = await createCategory(formData);

            if (response?.data?.success) {
              toast.success("Category created successfully");
            } else {
              toast.error(response.data.message);
            }
          } catch (err) {
            console.error("Category creation error:", err);
            toast.error("Category creation failed. Please try again.");
          }
        }}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Field
                name="categoryName"
                as={TextField}
                label="Category Name"
                fullWidth
              />
              <ErrorMessage
                style={{ color: "red" }}
                name="categoryName"
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
                <Typography>Category Image</Typography>
                <input type="file" onChange={handleFileInput} />
                {/* <Button
                  variant="outlined"
                  onClick={handleSubmit}
                  disabled={!selectedFile}
                >
                  Upload
                </Button> */}
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

export default CreateCategory;
