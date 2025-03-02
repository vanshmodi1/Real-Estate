import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyTitle: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    location: "",
    propertyCategory: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    squareFeet: "",
    propertyType: "BUY",
    images: [],
  });
  const [error, setError] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [propertyId, setPropertyId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      images: event.target.files,
    }));
  };

  // Fetch seller ID from local storage
  useEffect(() => {
    const id = localStorage.getItem("id");
    console.log("Retrieved seller ID:", id);
    if (id) {
      setSellerId(Number(id));
    } else {
      setError("Seller ID not found. Please log in.");
    }
  }, []);

  // Fetch property data for update
  const fetchPropertyData = async (propertyId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:9090/api/properties/${propertyId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property data.");
      }

      const data = await response.json();
      setFormData(data);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching property data:", error);
      setError(error.message);
    }
  };

  // Handle update button click
  const handleUpdateClick = () => {
    if (!propertyId) {
      setError("Please enter a valid property ID.");
      return;
    }
    fetchPropertyData(propertyId);
  };

  // Handle delete button click
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !sellerId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/api/properties/delete/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete property.");
      }

      navigate("/buy");
    } catch (error) {
      console.error("Error deleting property:", error);
      setError(error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token || !sellerId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => data.append("images", file));
      } else {
        data.append(key, formData[key]);
      }
    });

    data.append("sellerId", sellerId);

    try {
      const url = isEditing
        ? `http://localhost:9090/api/properties/update/${propertyId}`
        : "http://localhost:9090/api/properties/add";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to list property. Please try again.");
      }

      navigate("/buy");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {isEditing ? "Edit Your Property" : "List Your Property"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Property ID Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateClick}
          sx={{ mr: 2 }}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>

      {/* Add/Update Property Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="propertyTitle"
          value={formData.propertyTitle}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Discounted Price"
          name="discountedPrice"
          type="number"
          value={formData.discountedPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Discount Percent"
          name="discountPercent"
          type="number"
          value={formData.discountPercent}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Number of Bedrooms"
          name="numberOfBedrooms"
          type="number"
          value={formData.numberOfBedrooms}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Number of Bathrooms"
          name="numberOfBathrooms"
          type="number"
          value={formData.numberOfBathrooms}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Square Feet"
          name="squareFeet"
          type="number"
          value={formData.squareFeet}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Property Category</InputLabel>
          <Select name="propertyCategory" value={formData.propertyCategory} onChange={handleChange} required>
            <MenuItem value="Residential">Residential</MenuItem>
            <MenuItem value="Commercial">Commercial</MenuItem>
            <MenuItem value="Industrial">Industrial</MenuItem>
            <MenuItem value="Land">Land</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Property Type</InputLabel>
          <Select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
            <MenuItem value="BUY">For Buy</MenuItem>
            <MenuItem value="RENT">For Rent</MenuItem>
          </Select>
        </FormControl>

        <input type="file" multiple onChange={handleFileChange} accept="image/*" />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isEditing ? "Update Listing" : "Submit Listing"}
        </Button>
      </form>
    </Container>
  );
};

export default Sell;