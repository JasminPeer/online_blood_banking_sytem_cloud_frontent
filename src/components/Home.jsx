import React, { useEffect, useState } from "react";
import axios from "axios";
import bloodDonationImage from "../image/bllod.jpg";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button,
  Box,
  Modal,
  TextField,
  Paper,
  CssBaseline,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

// Use environment variable for backend URL
const API_URL = process.env.REACT_APP_API_URL;

function Home({ onRegister, openRegisterSignal }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    age: "",
    city: "",
    donations: 0,
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch donors from backend
  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/donors`);
      // Filter donors who are active if you have isExpired
      const activeDonors = res.data.filter((d) => !d.isExpired);
      setDonors(activeDonors);
    } catch (err) {
      console.error("Error fetching donors:", err);
      alert("Failed to load donors. Check backend & cloud connection.");
    }
  };

  useEffect(() => {
    fetchDonors();
    const sig = localStorage.getItem("lifeshare_prompt_register");
    if (sig === "1") {
      setOpen(true);
      localStorage.removeItem("lifeshare_prompt_register");
    }
  }, [openRegisterSignal]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", phone: "", bloodGroup: "", age: "", city: "", donations: 0 });
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.bloodGroup || !form.city) {
      alert("Please fill in Name, Phone, Blood Group, and City.");
      return;
    }

    const newDonor = {
      name: form.name,
      phone: form.phone,
      bloodGroup: form.bloodGroup.toUpperCase(),
      age: form.age ? Number(form.age) : null,
      donations: form.donations ? Number(form.donations) : 0,
      city: form.city,
    };

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/donors`, newDonor);
      setDonors((prev) => [res.data, ...prev]);
      localStorage.setItem("lifeshare_registered", JSON.stringify(res.data));
      if (typeof onRegister === "function") onRegister(res.data);
      alert(`Thanks ${res.data.name}! Registered as ${res.data.bloodGroup}.`);
      handleClose();
    } catch (err) {
      console.error("Error registering donor:", err.response?.data || err.message);
      alert(
        "Failed to register. Make sure backend & MongoDB Atlas are running and your .env is set!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ color: "#d32f2f", fontWeight: 700, mb: 2 }}>
                Welcome to LifeShare Blood Bank
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Manage donors, blood stock, and patient requests easily.
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpen}
                sx={{ backgroundColor: "#d32f2f", mb: 2 }}
              >
                Register as Donor
              </Button>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2">Quick links</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button size="small" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                  <Button size="small" component={Link} to="/blood-storage">
                    Blood Storage
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={bloodDonationImage}
                  alt="Online blood donation"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">How it works</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Register as a donor using the "Register as Donor" button.
                <br />
                • Track blood units in the Blood Storage page.
                <br />
                • Respond to patient requests and schedule drives.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Donors list */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Registered Donors
          </Typography>
          <Grid container spacing={2}>
            {donors.map((d) => (
              <Grid key={d._id} item xs={12} sm={6}>
                <Card elevation={6} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#d32f2f", width: 56, height: 56 }}>
                        {d.name ? d.name.charAt(0).toUpperCase() : "?"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{d.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {d.phone} | {d.city}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Chip
                          label={d.bloodGroup}
                          sx={{ bgcolor: "#ffe6e6", color: "#b71c1c", fontWeight: 700 }}
                        />
                      </Box>
                    </Stack>
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Typography variant="body2">
                        <strong>Age:</strong> {d.age ?? "—"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Donations:</strong> {d.donations}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box component="footer" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="caption">© 2025 LifeShare, All rights reserved!</Typography>
        </Box>
      </Container>

      {/* Register Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="register-modal">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", sm: 420 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="register-modal" variant="h6" sx={{ mb: 2, color: "#d32f2f" }}>
            Register as Donor
          </Typography>
          <TextField label="Full name" name="name" value={form.name} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Age" name="age" value={form.age} onChange={handleChange} type="number" fullWidth sx={{ mb: 2 }} />
          <TextField label="City" name="city" value={form.city} onChange={handleChange} required fullWidth sx={{ mb: 3 }} />
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#d32f2f", width: "100%" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Home;
