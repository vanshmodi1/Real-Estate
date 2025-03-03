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
  Grid,
  Card,
  CardContent,
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
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} sx={{ bgcolor: index % 2 ? "#fafafa" : "#ffffff" }}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
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
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Properties List
            </Typography>
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={3} key={property.id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
                      height: "100%", // Ensure cards have the same height
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.imageUrls?.[0] || "default-image-url.jpg"}
                      alt={property.propertyTitle}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {property.propertyTitle}
                      </Typography>
                      <Typography color="textSecondary">
                        Location: {property.location}
                      </Typography>
                      <Typography>Description: {property.description}</Typography>
                      <Typography color="primary" fontWeight="bold">
                        Price: Rs {property.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;