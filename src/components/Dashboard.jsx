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

const API = process.env.REACT_APP_API_URL;

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
          fetch(`${API}/api/donors`).then((r) => r.json()),
          fetch(`${API}/api/patients`).then((r) => r.json()),
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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPatient = {
      name: form.patientName,
      age: Number(form.age),
      bloodGroup: form.bloodGroup,
      units: Number(form.units),
      emergency: form.emergency,
    };

    try {
      const res = await fetch(`${API}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });

      const saved = await res.json();
      setPatients((prev) => [saved, ...prev]);

      setForm({
        patientName: "",
        age: "",
        bloodGroup: "",
        units: 1,
        emergency: false,
      });
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  const markResolved = async (id) => {
    try {
      await fetch(`${API}/api/patients/${id}`, { method: "DELETE" });
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
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ color: "#d32f2f", fontWeight: 700 }}>
                Patient Requests
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={4} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2">Donors Available</Typography>
                      <Typography variant="h5" sx={{ color: "#b71c1c", fontWeight: 800 }}>
                        {donors.length}
                      </Typography>
                    </Box>
                    <Chip label="Live" sx={{ color: "#b71c1c", fontWeight: 700 }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Add Patient Form */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }} elevation={2}>
                <Typography variant="h6">Add New Patient Request</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Patient Name"
                        name="patientName"
                        value={form.patientName}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Age"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Required Blood Group"
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <TextField
                        label="Units"
                        name="units"
                        value={form.units}
                        onChange={handleChange}
                        type="number"
                        inputProps={{ min: 1 }}
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                      <label>
                        <input
                          type="checkbox"
                          name="emergency"
                          checked={form.emergency}
                          onChange={handleChange}
                        />
                        Emergency
                      </label>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                        <TableCell colSpan={6} align="center">
                          No patient requests yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map((p) => (
                        <TableRow key={p._id}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.age || "—"}</TableCell>
                          <TableCell>
                            <Chip label={p.bloodGroup} color="error" />
                          </TableCell>
                          <TableCell>{p.units}</TableCell>
                          <TableCell>{p.emergency ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            <Button size="small" onClick={() => markResolved(p._id)}>
                              Resolve
                            </Button>
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
      </Container>
    </>
  );
}
