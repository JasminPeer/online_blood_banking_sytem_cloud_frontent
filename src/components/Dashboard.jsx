import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Stack,
  Divider,
  CircularProgress,
  CssBaseline,
} from "@mui/material";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    bloodGroup: "",
    units: 1,
    emergency: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [donorsRes, patientsRes] = await Promise.all([
          fetch("http://localhost:5000/api/donors").then((r) => r.json()),
          fetch("http://localhost:5000/api/patients").then((r) => r.json()),
        ]);
        setDonors(donorsRes || []);
        setPatients(patientsRes || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPatient = {
      name: form.patientName || "Unknown",
      age: form.age ? Number(form.age) : null,
      bloodGroup: form.bloodGroup || "-",
      units: form.units ? Number(form.units) : 1,
      emergency: !!form.emergency,
    };

    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      const saved = await res.json();
      setPatients((prev) => [saved, ...prev]);
      setForm({ patientName: "", age: "", bloodGroup: "", units: 1, emergency: false });
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  const markResolved = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/patients/${id}`, { method: "DELETE" });
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Header */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ color: "#d32f2f", fontWeight: 700 }}>
                Patient Requests
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Add patient requests, mark emergency cases, and see how many donors are currently available.
              </Typography>
            </Grid>

            {/* Donors Card */}
            <Grid item xs={12} md={4}>
              <Card elevation={4} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Donors Available
                      </Typography>
                      <Typography variant="h5" sx={{ color: "#b71c1c", fontWeight: 800 }}>
                        {donors.length}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Chip label="Live" sx={{ bgcolor: "#ffe6e6", color: "#b71c1c", fontWeight: 700 }} />
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Updated from backend
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Add patient form */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }} elevation={2}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Add New Patient Request
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField label="Patient Name" name="patientName" value={form.patientName} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField label="Age" name="age" value={form.age} onChange={handleChange} type="number" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField label="Required Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="e.g. O+" fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <TextField label="Units" name="units" value={form.units} onChange={handleChange} type="number" inputProps={{ min: 1 }} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                      <Box>
                        <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                          <input type="checkbox" name="emergency" checked={form.emergency} onChange={handleChange} style={{ width: 16, height: 16 }} />
                          <span style={{ marginLeft: 6 }}>Emergency</span>
                        </label>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button variant="outlined" onClick={() => setForm({ patientName: "", age: "", bloodGroup: "", units: 1, emergency: false })}>
                          Reset
                        </Button>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: "#d32f2f" }}>
                          Add Request
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Patient Table */}
            <Grid item xs={12}>
              <Paper elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Blood Group</TableCell>
                      <TableCell>Units</TableCell>
                      <TableCell>Emergency</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No patient requests yet.</TableCell>
                      </TableRow>
                    ) : (
                      patients.map((p) => (
                        <TableRow key={p._id}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.age ?? "—"}</TableCell>
                          <TableCell>
                            <Chip label={p.bloodGroup} sx={{ bgcolor: "#fff0f0", color: "#b71c1c", fontWeight: 700 }} />
                          </TableCell>
                          <TableCell>{p.units}</TableCell>
                          <TableCell>{p.emergency ? <Chip label="Yes" color="error" /> : <Chip label="No" />}</TableCell>
                          <TableCell>
                            <Button size="small" onClick={() => markResolved(p._id)}>Resolve</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer */}
        <Box component="footer" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption">© 2025 LifeShare , All rights reserved!!</Typography>
        </Box>
      </Container>
    </>
  );
}
