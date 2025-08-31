import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createCashier } from "../../Services/createCashier";

const CreateUser = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

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
        Create Cashier
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            console.log("Cashier values:", values);
            const response = await createCashier(values);
            console.log("Cashier creation response:", response);
            if (response?.data) {
              toast.success("Cashier created successfully");
              resetForm();
            } else {
              toast.error(
                response?.data?.message || "Failed to create cashier"
              );
            }
          } catch (err) {
            console.error("Cashier creation error:", err);
            toast.error("Cashier creation failed. Please try again.");
          }
        }}
      >
        <Form>
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Grid item xs={12} sm={6}>
              <Field name="name" as={TextField} label="Full Name" fullWidth />
              <ErrorMessage
                style={{ color: "red" }}
                name="name"
                component="div"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field
                name="username"
                as={TextField}
                label="Username"
                fullWidth
              />
              <ErrorMessage
                style={{ color: "red" }}
                name="username"
                component="div"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field
                name="password"
                as={TextField}
                type="password"
                label="Password"
                fullWidth
              />
              <ErrorMessage
                style={{ color: "red" }}
                name="password"
                component="div"
              />
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

export default CreateUser;
