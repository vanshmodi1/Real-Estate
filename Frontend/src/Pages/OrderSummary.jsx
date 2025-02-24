// import React from "react";
// import { Box, Typography, Card, CardContent, Grid, Button, List, ListItem, ListItemText } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";

// const OrderSummary = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Retrieve billing address and order details from location state
//   const { billingAddress, orderDetails } = location.state || {};

//   // If no data is found, show an error message
//   if (!billingAddress || !orderDetails) {
//     return (
//       <Box sx={{ padding: 2, textAlign: "center" }}>
//         <Typography variant="h6" color="error">
//           No data found. Please go back and try again.
//         </Typography>
//         <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ marginTop: 2 }}>
//           Go Back
//         </Button>
//       </Box>
//     );
//   }

//   // Handle payment redirection
//   const handlePayment = () => {
//     navigate("/payment"); // Redirect to payment page
//   };

//   return (
//     <Box sx={{ padding: 2, marginTop: "60px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
//       <Typography variant="h4" sx={{ marginBottom: 4 }}>
//         Order Summary
//       </Typography>

//       <Grid container spacing={4} sx={{ maxWidth: "1200px" }}>
//         {/* Order Details Section */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ width: "100%", height: "100%" }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ marginBottom: 2 }}>
//                 Order Details
//               </Typography>
//               <List>
//                 <ListItem>
//                   <ListItemText primary="Property Name" secondary={orderDetails.propertyName} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Price" secondary={`Rs ${orderDetails.price}`} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Location" secondary={orderDetails.location} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Description" secondary={orderDetails.description} />
//                 </ListItem>
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Billing Address Section */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ width: "100%", height: "100%" }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ marginBottom: 2 }}>
//                 Billing Address
//               </Typography>
//               <List>
//                 <ListItem>
//                   <ListItemText primary="First Name" secondary={billingAddress.firstName} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Last Name" secondary={billingAddress.lastName} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Address" secondary={billingAddress.address} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="City" secondary={billingAddress.city} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="State/Province/Region" secondary={billingAddress.state} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Zip/Postal Code" secondary={billingAddress.zip} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Phone Number" secondary={billingAddress.phone} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Billing Details" secondary={billingAddress.billingDetails} />
//                 </ListItem>
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Proceed to Payment Button */}
//       <Box sx={{ marginTop: 4, textAlign: "center" }}>
//         <Button variant="contained" color="primary" size="large" onClick={handlePayment}>
//           Proceed to Payment
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default OrderSummary;