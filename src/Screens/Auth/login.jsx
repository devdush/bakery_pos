import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../Services/login";
import { toast } from "react-toastify";

const AuthLogin = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    console.log("Login Values:", values);
    try {
      const response = await loginUser(values);
      console.log("Login Response:", response);
      if (response?.data) {
        localStorage.setItem("cashierId", response.data.data._id);
        localStorage.setItem("name", response.data.data.name);
        toast.success("Login successful!");
      }
      if (response?.data?.data.role === "admin") {
        // Redirect to admin dashboard
        window.location.href = "/admin/admin-dashboard";
      } else if (response?.data?.data.role === "cashier") {
        // Redirect to employee dashboard

        window.location.href = "/employee/dashboard";
      } else if (response?.data?.data.role === "stuart") {
        // Redirect to Stuart dashboard
        window.location.href = "/stuart/admin-dashboard";
      }
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#001f3f",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 3,
          bgcolor: "#ffffff5a",
          color: "#000000",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Login
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="username"
                  label="Username"
                  fullWidth
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  style={{ color: "red", fontSize: "0.8rem" }}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  type="password"
                  name="password"
                  label="Password"
                  fullWidth
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red", fontSize: "0.8rem" }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1 }}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Paper>
    </Box>
  );
};

export default AuthLogin;
