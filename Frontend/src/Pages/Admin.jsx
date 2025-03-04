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
  TextField,
  ListItemAvatar,
  Avatar,
  TextField as MuiTextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const API_URL = "http://localhost:9090";

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [todos, setTodos] = useState([]); // State for to-do items
  const [newTodo, setNewTodo] = useState(""); // State for new to-do input
  const [todoDate, setTodoDate] = useState(""); // State for to-do date
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users
    axios
      .get(`${API_URL}/users`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch properties
    axios
      .get(`${API_URL}/api/properties/all`)
      .then((response) => setProperties(response.data))
      .catch((error) => console.error("Error fetching properties:", error));

    // Fetch todos (assuming an API endpoint exists, otherwise initialize with local data)
    // For simplicity, we'll initialize with dummy data here
    setTodos([
      { id: 1, task: "Meeting with team", date: "2025-03-10T10:00" },
      { id: 2, task: "Review project updates", date: "2025-03-12T14:00" },
    ]);
  }, []);

  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`${API_URL}/api/messages?userId=${selectedUser.id}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [selectedUser]);

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

  const handleDeleteProperty = (id) => {
    axios
      .delete(`${API_URL}/api/properties/${id}`)
      .then(() => {
        setProperties(properties.filter((property) => property.id !== id));
      })
      .catch((error) => console.error("Error deleting property:", error));
  };

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

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedUser) return;

    const newMessage = {
      senderId: "admin",
      receiverId: selectedUser.id,
      message: replyText,
      timestamp: new Date().toISOString(),
    };

    axios
      .post(`${API_URL}/api/messages`, newMessage)
      .then((response) => {
        setMessages([...messages, response.data]);
        setReplyText("");
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const handleAddTodo = () => {
    if (!newTodo.trim() || !todoDate) return;

    const newTodoItem = {
      id: todos.length + 1, // Simple ID generation, replace with proper logic if needed
      task: newTodo,
      date: todoDate,
    };

    setTodos([...todos, newTodoItem]);
    setNewTodo("");
    setTodoDate("");

    // Optional: Save to backend via axios if an API endpoint exists
    // axios.post(`${API_URL}/api/todos`, newTodoItem)...
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    // Optional: Delete from backend via axios if an API endpoint exists
    // axios.delete(`${API_URL}/api/todos/${id}`)...
  };

  const getPropertyTypeDistribution = () => {
    const typeCounts = properties.reduce((acc, property) => {
      acc[property.propertyType] = (acc[property.propertyType] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(typeCounts).map((type) => ({
      name: type,
      value: typeCounts[type],
    }));
  };

  const getPriceFluctuationData = () => {
    const sortedProperties = [...properties].sort((a, b) => a.price - b.price);
    return sortedProperties.map((property) => ({
      name: property.propertyTitle,
      price: property.price,
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#123456",
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
          <ListItem button onClick={() => setActiveTab("messages")}>
            <ListItemText primary="Messages" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("todos")}>
            <ListItemText primary="To-Do" />
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
              Properties Overview
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Paper sx={{ p: 2, flex: 1, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Property Types Distribution
                </Typography>
                <PieChart width={400} height={300}>
                  <Pie
                    data={getPropertyTypeDistribution()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {getPropertyTypeDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Paper>
              <Paper sx={{ p: 2, flex: 1, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Price Fluctuation
                </Typography>
                <LineChart
                  width={500}
                  height={300}
                  data={getPriceFluctuationData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </Paper>
            </Box>
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
                          value={property.status || "ACTIVE"}
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
          </Box>
        )}

        {activeTab === "messages" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Messages
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Paper sx={{ width: 240, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Users
                </Typography>
                <List>
                  {users.map((user) => (
                    <ListItem
                      button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      selected={selectedUser?.id === user.id}
                    >
                      <ListItemText primary={user.name} secondary={user.role} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              <Paper sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 3 }}>
                {selectedUser ? (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Conversation with {selectedUser.name}
                    </Typography>
                    <List>
                      {messages.map((message) => (
                        <ListItem key={message.id}>
                          <ListItemAvatar>
                            <Avatar>{message.senderId === "admin" ? "A" : selectedUser.name[0]}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={message.senderId === "admin" ? "Admin" : selectedUser.name}
                            secondary={
                              <>
                                <Typography variant="body2">{message.message}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {new Date(message.timestamp).toLocaleString()}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendReply}
                      >
                        Send
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                    Select a user to start a conversation.
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        )}

        {activeTab === "todos" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              To-Do List
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <MuiTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <MuiTextField
                  type="datetime-local"
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTodo}
                  disabled={!newTodo || !todoDate}
                >
                  Add
                </Button>
              </Box>
              <List>
                {todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        Delete
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={todo.task}
                      secondary={new Date(todo.date).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
              {todos.length === 0 && (
                <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                  No tasks scheduled yet.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;