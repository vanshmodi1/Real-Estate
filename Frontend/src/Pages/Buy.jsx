import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  TextField,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [propertyNameSearch, setPropertyNameSearch] = useState("");
  const [priceSearch, setPriceSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setSnackbarMessage("Please log in to view properties.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "http://localhost:9090/api/properties/type/BUY",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch properties");
        }

        console.log("Fetched properties:", data); // Debugging Log
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Fetch error:", error);
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
        property.propertyTitle.toLowerCase().includes(
          propertyNameSearch.toLowerCase()
        ) &&
        property.price.toString().includes(priceSearch) &&
        property.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    });

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    handleSearchChange();
  }, [propertyNameSearch, priceSearch, locationSearch]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Available Properties for Sale
      </Typography>

      {/* Search Filters */}
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

      {/* Property List */}
      {filteredProperties.length > 0 ? (
        <Grid container spacing={2}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={3} key={property.id}>
              <Card
                sx={{
                  maxWidth: 345,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                  borderRadius: 2,
                  border: "1px solid #ddd",
                }}
              >
                <CardContent>
                  {property.imageUrl && (
                    <img
                      src={property.imageUrl}
                      alt={property.propertyTitle}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        marginBottom: 10,
                        border: "2px solid #ddd",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  <Typography variant="h6">{property.propertyTitle}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {property.location}
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    Price: Rs {property.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {property.description}
                  </Typography>

                  <Link to={`/viewdetails/${property.id}`}>
                    <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary">
          No properties found matching the search criteria.
        </Typography>
      )}

      {/* Snackbar for Error Handling */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Buy;
