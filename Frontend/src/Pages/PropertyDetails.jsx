import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated. Please log in.");

        const response = await fetch(`http://localhost:9090/api/properties/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!property) return <Typography>No property details available.</Typography>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="200"
          image={property.imageUrls?.[0] || "default-image-url.jpg"}
          alt={property.propertyTitle}
        />
        <CardContent>
          <Typography variant="h4">{property.propertyTitle}</Typography>
          <Typography variant="body1">{property.description}</Typography>
          <Typography variant="h6">Price: ₹{property.price.toLocaleString("en-IN")}</Typography>
          <Typography variant="body2">Discounted Price: ₹{property.discountedPrice.toLocaleString("en-IN")}</Typography>
          <Typography variant="body2">Location: {property.location}</Typography>
          <Typography variant="body2">Category: {property.propertyCategory}</Typography>
          <Typography variant="body2">Bedrooms: {property.numberOfBedrooms}</Typography>
          <Typography variant="body2">Bathrooms: {property.numberOfBathrooms}</Typography>
          <Typography variant="body2">Area: {property.squareFeet} sq ft</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PropertyDetails; // ✅ Ensure this default export exists
