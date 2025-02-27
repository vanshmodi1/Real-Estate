import React, { useState } from "react";
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

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
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

    try {
      const response = await fetch("http://localhost:9090/api/properties/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to list property. Please try again.");
      }

      navigate("/buy");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        List Your Property
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Title" name="propertyTitle" value={formData.propertyTitle} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} required />
        <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Discounted Price" name="discountedPrice" type="number" value={formData.discountedPrice} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Discount Percent" name="discountPercent" type="number" value={formData.discountPercent} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Number of Bedrooms" name="numberOfBedrooms" type="number" value={formData.numberOfBedrooms} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Number of Bathrooms" name="numberOfBathrooms" type="number" value={formData.numberOfBathrooms} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Square Feet" name="squareFeet" type="number" value={formData.squareFeet} onChange={handleChange} fullWidth margin="normal" required />
        
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
          Submit Listing
        </Button>
      </form>
    </Container>
  );
};

export default Sell;
