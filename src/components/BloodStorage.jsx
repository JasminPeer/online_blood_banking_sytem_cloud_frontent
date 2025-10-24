// src/components/BloodStorage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function BloodStorage() {
  const [bloodStock, setBloodStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch blood stock from backend
  const fetchBloodStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/blood");
      setBloodStock(res.data || []);
    } catch (err) {
      console.error("Error fetching blood stock:", err);
      setBloodStock([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodStock(); // initial fetch

    // Poll every 10 seconds for updates
    const interval = setInterval(() => {
      fetchBloodStock();
    }, 10000);

    return () => clearInterval(interval); // cleanup
  }, []);

  // Emergency blood groups (units <= 2)
  const emergencyGroups = bloodStock.filter((b) => b.units <= 2);

  // Units expiring within 7 days
  const expiringSoon = bloodStock.filter((b) => b.expiryDays <= 7);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" sx={{ color: "#d32f2f", fontWeight: 700, mb: 2 }}>
        Blood Storage
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Blood Units Table */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Current Stock
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Units Available</TableCell>
                  <TableCell>Expiry (Days)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bloodStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No blood stock data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  bloodStock.map((b) => (
                    <TableRow key={b.bloodGroup}>
                      <TableCell>{b.bloodGroup}</TableCell>
                      <TableCell>
                        <Chip
                          label={b.units}
                          sx={{
                            bgcolor: b.units <= 2 ? "#ffebee" : "#fff0f0",
                            color: "#b71c1c",
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>{b.expiryDays}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Emergency Blood Groups */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Emergency Blood Groups
            </Typography>
            <Grid container spacing={2}>
              {emergencyGroups.length === 0 ? (
                <Typography sx={{ ml: 2 }}>No emergency blood needed currently.</Typography>
              ) : (
                emergencyGroups.map((b) => (
                  <Grid item key={b.bloodGroup}>
                    <Card sx={{ borderRadius: 2, minWidth: 120, bgcolor: "#ffe6e6" }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#b71c1c" }}>
                          {b.bloodGroup}
                        </Typography>
                        <Typography>Units left: {b.units}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>

          {/* Expiring Soon */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Units Expiring Soon (≤ 7 Days)
            </Typography>
            {expiringSoon.length === 0 ? (
              <Typography sx={{ ml: 2 }}>No units expiring within the next 7 days.</Typography>
            ) : (
              <Grid container spacing={2}>
                {expiringSoon.map((b) => (
                  <Grid item key={b.bloodGroup}>
                    <Card sx={{ borderRadius: 2, minWidth: 120, bgcolor: "#fff0f0" }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#b71c1c" }}>
                          {b.bloodGroup}
                        </Typography>
                        <Typography>Units: {b.units}</Typography>
                        <Typography>Expires in: {b.expiryDays} days</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </>
      )}

      {/* Footer */}
      <Box component="footer" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption">© 2025 LifeShare , All rights are reserved!!</Typography>
      </Box>
    </Container>
  );
}
