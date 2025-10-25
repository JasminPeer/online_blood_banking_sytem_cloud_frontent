import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    query: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${form.name}! Your query has been submitted.`);
    setForm({ name: "", age: "", query: "" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" sx={{ color: "#d32f2f", fontWeight: 700, mb: 4 }}>
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        {/* Map Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: "100%", borderRadius: 2, overflow: "hidden" }}>
            <iframe
              title="Blood Bank Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.123456!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267abcd1234%3A0xabcdef123456!2sChennai%20Blood%20Bank!5e0!3m2!1sen!2sin!4v1695000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Paper>
        </Grid>

        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={form.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                fullWidth
                required
                value={form.age}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Your Query"
                name="query"
                multiline
                rows={4}
                fullWidth
                required
                value={form.query}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#d32f2f",
                  "&:hover": { bgcolor: "#b71c1c" },
                }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Marquee for Mobile Number */}
      <Box sx={{ mt: 4, bgcolor: "#ffebee", p: 1, borderRadius: 2 }}>
        <p behavior="scroll" direction="left" style={{ color: "#b71c1c", fontWeight: 700 }}>
          📞 Contact us at: +91 9876543210 | +91 9123456780
        </p>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="caption">© 2025 LifeShare , All rights are resserved!!</Typography>
      </Box>
    </Container>
  );
}
