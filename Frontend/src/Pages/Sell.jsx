import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert, MenuItem, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";

const Sell = () => {
  const [propertyId, setPropertyId] = useState("");
  const [sellerId, setSellerId] = useState(localStorage.getItem("id") || ""); // Get ID from localStorage
  const [propertyDetails, setPropertyDetails] = useState({
    propertyName: "",
    description: "",
    price: "",
    location: "",
    image: "", // Store image URL
    type: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showUpdateForm, setShowUpdateForm] = useState(false); // To toggle the update form visibility
  const [addPropertyForm, setAddPropertyForm] = useState(true); // To show/hide Add Property form

  const token = localStorage.getItem("token"); // Get Token from localStorage

  useEffect(() => {
    setSellerId(localStorage.getItem("id") || ""); // Ensure sellerId is set when component loads
  }, []);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleInputChange = (e) => {
    setPropertyDetails({ ...propertyDetails, [e.target.name]: e.target.value });
  };

  const makeRequest = async (url, method, body) => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });
    return response.json();
  };

  const handleAddProperty = async () => {
    if (!sellerId) {
      setSnackbarMessage("Seller ID not found. Please log in again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const result = await makeRequest(`http://localhost:9090/property/add/${sellerId}`, "POST", propertyDetails);
    setSnackbarMessage(result.message || "Property added successfully!");
    setSnackbarSeverity(result.error ? "error" : "success");
    setSnackbarOpen(true);
  };

  const handleUpdateProperty = async () => {
    if (!propertyId) {
      setSnackbarMessage("Please enter a property ID.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const result = await makeRequest(`http://localhost:9090/property/update/${propertyId}`, "PUT", propertyDetails);
    setSnackbarMessage(result.message || "Property updated successfully!");
    setSnackbarSeverity(result.error ? "error" : "success");
    setSnackbarOpen(true);
    setShowUpdateForm(false); // Hide update form after update
    setAddPropertyForm(true); // Show Add Property form again after update
  };

  const handleDeleteProperty = async () => {
    if (!propertyId) {
      setSnackbarMessage("Please enter a property ID.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const result = await makeRequest(`http://localhost:9090/property/delete/${propertyId}`, "DELETE");
    setSnackbarMessage(result.message || "Property deleted successfully!");
    setSnackbarSeverity(result.error ? "error" : "success");
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Property Management</Typography>

      {/* Update/Delete Property Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Update/Delete Property</Typography>
        <TextField
          label="Property ID"
          fullWidth
          margin="normal"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          required
        />
        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <Button variant="contained" color="warning" onClick={() => { setShowUpdateForm(true); setAddPropertyForm(false); }}>Update Property</Button>
          <Button variant="contained" color="error" onClick={handleDeleteProperty}>Delete Property</Button>
        </Box>
      </Box>

      {/* Add Property Section */}
      {addPropertyForm && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5">Add Property</Typography>
          <TextField label="Seller ID" fullWidth margin="normal" value={sellerId} disabled />
          <TextField label="Property Name" name="propertyName" fullWidth margin="normal" value={propertyDetails.propertyName} onChange={handleInputChange} required />
          <TextField label="Description" name="description" fullWidth multiline rows={4} margin="normal" value={propertyDetails.description} onChange={handleInputChange} required />
          <TextField label="Price" name="price" fullWidth margin="normal" value={propertyDetails.price} onChange={handleInputChange} required />
          <TextField label="Location" name="location" fullWidth margin="normal" value={propertyDetails.location} onChange={handleInputChange} required />
          
          {/* Image URL Input */}
          <TextField
            label="Image URL"
            name="image"
            fullWidth
            margin="normal"
            value={propertyDetails.image}
            onChange={handleInputChange}
            required
          />

          <TextField select label="Type" name="type" fullWidth margin="normal" value={propertyDetails.type} onChange={handleInputChange} required>
            <MenuItem value="BUY">BUY</MenuItem>
            <MenuItem value="RENT">RENT</MenuItem>
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAddProperty} sx={{ marginTop: 2 }}>Add Property</Button>
        </Box>
      )}

      {/* Update Property Form (Visible when Update is clicked) */}
      {showUpdateForm && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5">Update Property Details</Typography>
          <TextField label="Property Name" name="propertyName" fullWidth margin="normal" value={propertyDetails.propertyName} onChange={handleInputChange} required />
          <TextField label="Description" name="description" fullWidth multiline rows={4} margin="normal" value={propertyDetails.description} onChange={handleInputChange} required />
          <TextField label="Price" name="price" fullWidth margin="normal" value={propertyDetails.price} onChange={handleInputChange} required />
          <TextField label="Location" name="location" fullWidth margin="normal" value={propertyDetails.location} onChange={handleInputChange} required />
          
          {/* Image URL Input */}
          <TextField
            label="Image URL"
            name="image"
            fullWidth
            margin="normal"
            value={propertyDetails.image}
            onChange={handleInputChange}
            required
          />

          <TextField select label="Type" name="type" fullWidth margin="normal" value={propertyDetails.type} onChange={handleInputChange} required>
            <MenuItem value="BUY">BUY</MenuItem>
            <MenuItem value="RENT">RENT</MenuItem>
          </TextField>
          <Button variant="contained" color="warning" onClick={handleUpdateProperty} sx={{ marginTop: 2 }}>Update Property</Button>
        </Box>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sell;
