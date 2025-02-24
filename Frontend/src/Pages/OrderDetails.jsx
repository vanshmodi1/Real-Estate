import React from "react";
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { property } = location.state || {}; // Access the property data passed via navigation

  // If no property data is found, show an error message
  if (!property) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          No property details found. Please go back and try again.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ marginTop: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Destructure property details
  const { propertyName, price, location: propertyLocation, description, image } = property;

  return (
    <Box sx={{ padding: 2, marginTop: "60px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Order Details
      </Typography>

      <Grid container spacing={4} sx={{ maxWidth: "1200px" }}>
        {/* Property Image */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ width: "100%", height: "100%" }}>
            <img
              src={image}
              alt={propertyName}
              style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
            />
          </Card>
        </Grid>

        {/* Property Details */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ width: "100%", height: "100%", padding: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {propertyName}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                <strong>Price:</strong> Rs {price}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                <strong>Location:</strong> {propertyLocation}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                <strong>Description:</strong> {description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={() => navigate("/payment")}>
          Proceed to Payment
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default OrderDetails;