import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Box, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import excelLogo from "../assets/excel_logo.png"; // Updated logo with reduced spacing
import login from "../assets/login.png"; // Import login image

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [username, setUsername] = useState(null); // State to store the username
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [role, setRole] = useState(null); // State to store user role

  const navigate = useNavigate(); // Hook for navigation

  // Load username and role from localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUsername) {
      setUsername(storedUsername);
      setRole(storedRole);
      setIsLoggedIn(true); // Set logged-in status if a username is found in localStorage
    }
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    // Clear username and set isLoggedIn to false
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setUsername(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#123456", width: "100%", zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: "space-between", maxWidth: "1200px", mx: "auto", width: "100%" }}>
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
            <img src={excelLogo} alt="XcelEstate Logo" style={{ height: "60px", marginRight: "5px" }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
              XcelEstate
            </Typography>
          </Link>
        </Box>
        {/* Main Navigation Section */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/buy">Buy</Button>
          <Button color="inherit" component={Link} to="/rent">Rent</Button>
          {/* Show Sell option only if the user is a Seller */}
          {role === "SELLER" && <Button color="inherit" component={Link} to="/sell">Sell</Button>}
          <Button color="inherit" component={Link} to="/contact">Contact</Button>
          {/* Button with Login/Logout Image */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={login}
              alt={isLoggedIn ? "Logout" : "Login"}
              height={50}
              width={50}
              style={{ marginLeft: "290px", borderRadius: "50%", cursor: "pointer" }}
              onClick={toggleDrawer(true)}
            />
            {username && (
              <Typography variant="body1" sx={{ color: "white", marginLeft: "10px" }}>
                {username}
              </Typography>
            )}
          </Box>
        </Box>
        {/* Sidebar (Drawer) */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
              {/* Display login/register options when not logged in */}
              {!isLoggedIn ? (
                <>
                  <ListItem button onClick={handleLoginClick}>
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem button onClick={handleRegisterClick}>
                    <ListItemText primary="Register" />
                  </ListItem>
                </>
              ) : (
                <>
                  {role === "BUYER" && (
                    <>
                      <ListItem button component={Link} to="/wishlist">
                        <ListItemText primary="Wishlist" />
                      </ListItem>
                      <ListItem button component={Link} to="/add-to-cart">
                        <ListItemText primary="Add to Cart" />
                      </ListItem>
                    </>
                  )}
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
