import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button, Snackbar, Alert, TextField, Grid } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [propertyNameSearch, setPropertyNameSearch] = useState("");
  const [priceSearch, setPriceSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    if (!token) {
      setSnackbarMessage("Please log in to view properties.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:9090/property/type/BUY", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        if (data.error) {
          setSnackbarMessage(data.message || "Error fetching properties.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          setProperties(data); // Assuming response returns an array of properties
          setFilteredProperties(data);
        }
      } catch (error) {
        console.error(error);
        setSnackbarMessage("An error occurred while fetching properties.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchProperties();
  }, [token]);

  const handleSearchChange = () => {
    const filtered = properties.filter((property) => {
      return (
        property.propertyName.toLowerCase().includes(propertyNameSearch.toLowerCase()) &&
        property.price.toString().includes(priceSearch) &&
        property.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    });

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    handleSearchChange(); // Filter properties every time any search field changes
  }, [propertyNameSearch, priceSearch, locationSearch]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleViewDetails = (propertyId) => {
    localStorage.setItem("propertyId", propertyId); // Store propertyId in localStorage
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Available Properties for Sale</Typography>

      {/* Search Bar Sections */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Search by Property Name"
          fullWidth
          value={propertyNameSearch}
          onChange={(e) => setPropertyNameSearch(e.target.value)}
        />
        <TextField
          label="Search by Price"
          fullWidth
          value={priceSearch}
          onChange={(e) => setPriceSearch(e.target.value)}
        />
        <TextField
          label="Search by Location"
          fullWidth
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
        />
      </Box>

      {filteredProperties.length > 0 ? (
        <Grid container spacing={2} justifyContent="space-between">
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={3} key={property.id}>
              <Card sx={{
                maxWidth: 345,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                borderRadius: 2,
                border: "1px solid #ddd"
              }}>
                <CardContent>
                  {/* Display Image */}
                  {property.image && (
                    <img
                      src={property.image}
                      alt={property.propertyName}
                      style={{
                        width: "100%",
                        height: "200px", // Fixed height for consistent image size
                        objectFit: "cover", // Ensures image is not distorted
                        marginBottom: 10,
                        border: "2px solid #ddd", // Adding border around images
                        borderRadius: "8px", // Optional: rounding the image corners
                      }}
                    />
                  )}

                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {property.propertyName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    {property.location}
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ marginBottom: 1 }}>
                    Price: Rs {property.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                    {property.description}
                  </Typography>

                  {/* View Details Button */}
                  <Link to="/viewdetails">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ marginTop: 2 }} 
                      onClick={() => handleViewDetails(property.id)} // Save propertyId before navigation
                    >
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary">No properties found matching the search criteria.</Typography>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Buy;
