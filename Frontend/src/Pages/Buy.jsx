import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated. Please log in.");

      const response = await fetch("http://localhost:9090/api/properties/type/BUY", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = (property) => {
    setWishlist((prevWishlist) => {
      const isAlreadyInWishlist = prevWishlist.some((item) => item.id === property.id);
      const updatedWishlist = isAlreadyInWishlist
        ? prevWishlist.filter((item) => item.id !== property.id)
        : [...prevWishlist, property];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const goToWishlist = () => {
    navigate("/wishlist");
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Properties for Buy
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={goToWishlist}
          startIcon={<FavoriteIcon />}
        >
          Wishlist ({wishlist.length})
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={property.imageUrls?.[0] || "default-image-url.jpg"}
                alt={property.propertyTitle}
              />
              <IconButton
                onClick={() => handleAddToWishlist(property)}
                color="secondary"
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                {wishlist.some((item) => item.id === property.id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <CardContent>
                <Typography variant="h6">{property.propertyTitle}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {property.description}
                </Typography>
                <Typography variant="body1" color="textPrimary" mt={1}>
                  Price: ₹{property.price.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Discount: {property.discountPercent}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Discounted Price: ₹{property.discountedPrice.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {property.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {property.propertyCategory}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bedrooms: {property.numberOfBedrooms}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bathrooms: {property.numberOfBathrooms}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Area: {property.squareFeet} sq ft
                </Typography>
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(property.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={goToWishlist}
                  >
                    Go to Wishlist
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Buy;