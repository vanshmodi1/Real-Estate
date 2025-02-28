import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      const response = await fetch("http://localhost:9090/api/properties/type/BUY", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Properties for Buy
      </Typography>
      {loading && <CircularProgress />} {/* Show loading spinner */}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={property.imageUrls && property.imageUrls[0] ? property.imageUrls[0] : "default-image-url.jpg"} // Fallback image
                alt={property.propertyTitle}
              />
              <CardContent>
                <Typography variant="h6">{property.propertyTitle}</Typography>
                <Typography variant="body2">{property.description}</Typography>
                <Typography variant="body1">Price: ₹{property.price.toLocaleString('en-IN')}</Typography>
                <Typography variant="body2">Discount: {property.discountPercent}%</Typography>
                <Typography variant="body2">Discounted Price: ₹{property.discountedPrice.toLocaleString('en-IN')}</Typography>
                <Typography variant="body2">Location: {property.location}</Typography>
                <Typography variant="body2">Category: {property.propertyCategory}</Typography>
                <Typography variant="body2">Bedrooms: {property.numberOfBedrooms}</Typography>
                <Typography variant="body2">Bathrooms: {property.numberOfBathrooms}</Typography>
                <Typography variant="body2">Area: {property.squareFeet} sq ft</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Buy;
