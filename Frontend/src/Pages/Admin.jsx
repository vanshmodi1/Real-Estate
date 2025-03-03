import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:9090";

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/users`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    axios
      .get(`${API_URL}/api/properties/all`)
      .then((response) => setProperties(response.data))
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  const handleRoleChange = (id, newRole) => {
    setEditedRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const saveRoleChange = (id) => {
    if (!editedRoles[id]) return;

    axios
      .put(
        `${API_URL}/users/${id}/role`,
        { role: editedRoles[id] },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, role: editedRoles[id] } : user
          )
        );
        setEditedRoles((prev) => {
          const updatedRoles = { ...prev };
          delete updatedRoles[id];
          return updatedRoles;
        });
      })
      .catch((error) => console.error("Error updating user role:", error));
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // Function to handle property deletion
  const handleDeleteProperty = (id) => {
    axios
      .delete(`${API_URL}/api/properties/${id}`)
      .then(() => {
        setProperties(properties.filter((property) => property.id !== id));
      })
      .catch((error) => console.error("Error deleting property:", error));
  };

  // Function to handle property status update
  const handleUpdateStatus = (id, newStatus) => {
    axios
      .put(
        `${API_URL}/api/properties/${id}/status`,
        { status: newStatus },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(() => {
        setProperties(
          properties.map((property) =>
            property.id === id ? { ...property, status: newStatus } : property
          )
        );
      })
      .catch((error) => console.error("Error updating property status:", error));
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#123456", // Updated color for the header
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setActiveTab("users")}>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("properties")}>
            <ListItemText primary="Properties" />
          </ListItem>
          <ListItem button onClick={handleLogout} sx={{ mt: "auto" }}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {activeTab === "users" && (
          <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Users List
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Role</b></TableCell>
                  <TableCell><b>Created At</b></TableCell>
                  <TableCell><b>Updated At</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} sx={{ bgcolor: index % 2 ? "#fafafa" : "#ffffff" }}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.updatedAt}</TableCell>
                    <TableCell>
                      <Select
                        value={editedRoles[user.id] || user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <MenuItem value="BUYER">Buyer</MenuItem>
                        <MenuItem value="SELLER">Seller</MenuItem>
                        <MenuItem value="AGENT">Agent</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => saveRoleChange(user.id)}
                        disabled={
                          !editedRoles[user.id] || editedRoles[user.id] === user.role
                        }
                      >
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === "properties" && (
          <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Properties List
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                  <TableCell><b>Image</b></TableCell>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Location</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>Price</b></TableCell>
                  <TableCell><b>Discounted Price</b></TableCell>
                  <TableCell><b>Discount Percent</b></TableCell>
                  <TableCell><b>Property Type</b></TableCell>
                  <TableCell><b>Property Category</b></TableCell>
                  <TableCell><b>Number of Bedrooms</b></TableCell>
                  <TableCell><b>Number of Bathrooms</b></TableCell>
                  <TableCell><b>Square Feet</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property, index) => (
                  <TableRow key={property.id} sx={{ bgcolor: index % 2 ? "#fafafa" : "#ffffff" }}>
                    <TableCell>
                      <CardMedia
                        component="img"
                        height="100"
                        image={property.imageUrls?.[0] || "default-image-url.jpg"}
                        alt={property.propertyTitle}
                        sx={{ objectFit: "cover", borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>{property.propertyTitle}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.description}</TableCell>
                    <TableCell>Rs {property.price}</TableCell>
                    <TableCell>{property.discountedPrice}</TableCell>
                    <TableCell>{property.discountPercent}</TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>{property.propertyCategory}</TableCell>
                    <TableCell>{property.numberOfBedrooms}</TableCell>
                    <TableCell>{property.numberOfBathrooms}</TableCell>
                    <TableCell>{property.squareFeet}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteProperty(property.id)}
                        sx={{ mb: 1 }}
                      >
                        Delete
                      </Button>
                      <Select
                        value={property.status || "ACTIVE"} // Default status
                        onChange={(e) => handleUpdateStatus(property.id, e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="SOLD">Sold</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;