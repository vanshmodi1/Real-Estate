import React, { useRef, useState } from "react";
import { Box, Typography, Button, TextField, MenuItem, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import homeBg from "../assets/home_bg.jpg";

const Home = () => {
  const testimonialsRef = useRef(null);
  const footerRef = useRef(null);

  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const scrollToTestimonials = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Search Section */}
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* Heading & Subheading */}
        <Typography variant="h2" fontWeight="bold">
          Find Your Dream Property
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
          <Link to="/buy" style={{ textDecoration: "none", fontWeight: "bold", color: "inherit" }}>Buy</Link> | 
          <Link to="/rent" style={{ textDecoration: "none", fontWeight: "bold", color: "inherit" }}> Rent</Link> | 
          <Link to="/sell" style={{ textDecoration: "none", fontWeight: "bold", color: "inherit" }}> Sell</Link> 
        </Typography>

        {/* Search Bar */}
        <Box sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          maxWidth: "900px",
          bgcolor: "rgba(255, 255, 255, 0.2)",
          p: 3,
          borderRadius: "10px",
          backdropFilter: "blur(8px)",
          mt: 2
        }}>
          <TextField 
            label="Location" 
            variant="outlined" 
            sx={{ bgcolor: "white", width: "30%" }} 
          />

          <TextField
            select
            label="Property Type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            variant="outlined"
            sx={{ bgcolor: "white", width: "30%" }}
          >
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
          </TextField>

          <TextField
            select
            label="Price Range"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            variant="outlined"
            sx={{ bgcolor: "white", width: "30%" }}
          >
            <MenuItem value="0-50K">₹0 - ₹50K</MenuItem>
            <MenuItem value="50K-1L">₹50K - ₹1L</MenuItem>
          </TextField>

          <Button variant="contained" color="primary">Search</Button>
        </Box>

        {/* Scroll Indicator */}
        <Box sx={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}>
          <Button onClick={scrollToTestimonials} sx={{ color: "white", minWidth: "auto" }}>
            <ExpandMoreIcon sx={{ fontSize: 40 }} />
          </Button>
        </Box>
      </Box>

      {/* Testimonials Section */}
      <Box
        ref={testimonialsRef}
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: "20px",
          position: "relative",
        }}
      >
        <Typography variant="h4" fontWeight="bold">What Our Clients Say</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 3 }}>
          {[
            { id: 1, text: "Amazing service! Found my dream home effortlessly.", author: "Amit P." },
            { id: 2, text: "Professional and smooth process. Highly recommended!", author: "Riya S." },
            { id: 3, text: "I sold my house in just 5 days! Thank you.", author: "Aniket D." },
            { id: 4, text: "They really care about your needs and help at every step.", author: "Pooja J." },
          ].map((testimonial) => (
            <Card 
              key={testimonial.id} 
              sx={{ 
                width: "250px", 
                bgcolor: "rgba(255,255,255,0.9)", 
                borderRadius: "10px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { 
                  transform: "scale(1.05)", 
                  boxShadow: "0px 0px 15px rgba(255,255,255,0.8)"
                }
              }}
            >
              <CardContent>
                <Typography variant="body1" sx={{ fontStyle: "italic", color: "#333" }}>
                  "{testimonial.text}"
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold", color: "#555" }}>
                  - {testimonial.author}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Scroll Indicator - Leads to Footer */}
        <Box sx={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}>
          <Button onClick={scrollToFooter} sx={{ color: "white", minWidth: "auto" }}>
            <ExpandMoreIcon sx={{ fontSize: 40 }} />
          </Button>
        </Box>
      </Box>

      {/* Footer (Reference for Scrolling) */}
      <Box ref={footerRef}></Box>
    </>
  );
};

export default Home;
