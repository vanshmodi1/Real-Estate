import { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);



  // Remove the property with the given id from the wishlist
  const handleRemoveFromWishlist = (id) => {
    // Filter out the property with the clicked propertyId (id)
    const updatedWishlist = wishlist.filter((property) => property.id !== id);
    setWishlist(updatedWishlist); // Update state to reflect changes
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage
  };

  return (
    <Box sx={{ padding: 2, marginTop: "60px" }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        My Wishlist
      </Typography>
      <Grid container spacing={4}>
        {wishlist.length === 0 ? (
          <Typography variant="h6" color="textSecondary" margin={"35px"}>
            Your wishlist is empty.
          </Typography>
        ) : (
          wishlist.map((property) => (
            <Grid item xs={12} sm={4} key={property.id}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h5">{property.propertyName}</Typography>
                  <Typography variant="body2">Price: Rs {property.price}</Typography>
                  <Typography variant="body1">Location: {property.location}</Typography>
                  <Typography variant="body2">{property.description}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={() => navigate("/viewdetails")} // Use property.id to navigate
                  >
            
                    View Property
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginTop: 2, marginLeft: 1 }}
                    onClick={() => handleRemoveFromWishlist(property.id)} // Remove property based on its id
                  >
                    Remove from Wishlist
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Wishlist;
