import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, CardMedia,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Drawer, List, ListItem, ListItemText, Grid, Card, CardContent, Button } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:9090"; // Backend API URL

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editedRoles, setEditedRoles] = useState({}); // Track role changes before submitting
  const [activeTab, setActiveTab] = useState("users");

  // Fetch Users & Properties from Backend
  useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));

    axios.get(`${API_URL}/api/properties/all`)
      .then(response => setProperties(response.data))
      .catch(error => console.error("Error fetching properties:", error));
  }, []);

  // Track selected role before submission
  const handleRoleChange = (id, newRole) => {
    setEditedRoles(prev => ({ ...prev, [id]: newRole }));
  };

  // Submit role change when "Save" button is clicked
  const saveRoleChange = (id) => {
    if (!editedRoles[id]) return; // Prevent unnecessary API calls

    axios.put(`${API_URL}/users/${id}/role`, { role: editedRoles[id] }, { // ✅ Fixed: Sending as JSON
      headers: { "Content-Type": "application/json" }
    })
    .then(() => {
      setUsers(users.map(user => (user.id === id ? { ...user, role: editedRoles[id] } : user)));
      setEditedRoles(prev => {
        const updatedRoles = { ...prev };
        delete updatedRoles[id]; // Remove saved role from editedRoles
        return updatedRoles;
      });
    })
    .catch(error => console.error("Error updating user role:", error));
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer 
        variant="permanent" 
        sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" } }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setActiveTab("users")}>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("properties")}>
            <ListItemText primary="Properties" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {/* Users List */}
        {activeTab === "users" && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Users List</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={editedRoles[user.id] || user.role} // Show new role if changed
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
                        disabled={!editedRoles[user.id] || editedRoles[user.id] === user.role} // Disable if no change
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

        {/* Properties List */}
        {activeTab === "properties" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Properties List</Typography>
            <Grid container spacing={2}>
              {properties.map(property => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <Card>
                    <CardContent>
                    <CardMedia
                component="img"
                height="140"
                image={property.imageUrls?.[0] || "default-image-url.jpg"}
                alt={property.propertyTitle}
              />
                      <Typography>Location: {property.location}</Typography>
                      <Typography>Description: {property.description}</Typography>
                      <Typography>Price: ${property.price}</Typography>
                      <Typography>No Of BedRooms: {property.numberOfBedrooms}</Typography>
                      <Typography>No Of BathRooms: {property.numberOfBathrooms}</Typography>
                      <Typography>Type: {property.propertyType}</Typography>
                      <Typography>SquareFeet: {property.squareFeet}</Typography>
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
