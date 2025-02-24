import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BillingAddress = () => {
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    billingDetails: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        billingAddress: formData, // Pass billing address data
        orderDetails: location.state?.property, // Pass order details from location state
      },
    });
  };

  return (
    <Box sx={{ padding: 2, marginTop: "60px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Billing Address
      </Typography>

      <Card sx={{ width: "100%", maxWidth: "800px", padding: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* State/Province/Region */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province/Region"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Zip/Postal Code */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zip/Postal Code"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Billing Details */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Billing Details"
                  name="billingDetails"
                  value={formData.billingDetails}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button type="submit" variant="contained" color="primary" size="large">
                  Payment
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingAddress;