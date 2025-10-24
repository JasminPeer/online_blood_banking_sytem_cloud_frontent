import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function Capsule() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get registered donor ID from localStorage
    const data = localStorage.getItem("lifeshare_registered");
    if (data) {
      const donor = JSON.parse(data);

      // Fetch donor info from backend
      fetch(`http://localhost:5000/api/donors/${donor.id}`)
        .then((res) => res.json())
        .then((resp) => {
          setUserInfo(resp);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching donor info:", err);
          setUserInfo(donor); // fallback to localStorage data
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // If no user is registered, show lock message
  if (!userInfo) {
    return (
      <Container sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            p: 5,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <LockIcon sx={{ fontSize: 60, color: "#b71c1c", mb: 2 }} />
          <Typography variant="h6">Time Capsule Locked</Typography>
          <Typography sx={{ mt: 2 }}>
            Please register first on the Home page to access your capsule.
          </Typography>
        </Card>
      </Container>
    );
  }

  // Calculate milestones
  const capsules = [
    { title: "Capsule 1", unlockCondition: "After 1 donation" },
    { title: "Capsule 2", unlockCondition: "After 3 donations" },
    { title: "Capsule 3", unlockCondition: "After 5 donations or 1 year since first donation" },
  ];

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        sx={{ color: "#d32f2f", fontWeight: 700, mb: 4, textAlign: "center" }}
      >
        Time Capsule
      </Typography>

      {/* Registered User Info Card */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#d32f2f" }}>
          Your Registered Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Name:</strong> {userInfo.name}
            </Typography>
            <Typography>
              <strong>Age:</strong> {userInfo.age}
            </Typography>
            <Typography>
              <strong>Blood Group:</strong> {userInfo.bloodGroup}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>No. of Units:</strong> {userInfo.units || 1}
            </Typography>
            <Typography>
              <strong>No. of Donations:</strong> {userInfo.donations || 0}
            </Typography>
            <Typography>
              <strong>Years since First Donation:</strong> {userInfo.years || 0}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Capsule Cards */}
      <Grid container spacing={4}>
        {capsules.map((c, idx) => {
          const unlocked =
            (c.title === "Capsule 1" && userInfo.donations >= 1) ||
            (c.title === "Capsule 2" && userInfo.donations >= 3) ||
            (c.title === "Capsule 3" &&
              (userInfo.donations >= 5 || userInfo.years >= 1));

          return (
            <Grid item xs={12} sm={4} key={idx}>
              <Card
                sx={{
                  p: 5,
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { boxShadow: "0 15px 40px rgba(0,0,0,0.2)" },
                  bgcolor: unlocked ? "#ffe6e6" : "#f5f5f5",
                }}
              >
                <LockIcon
                  sx={{
                    fontSize: 60,
                    color: unlocked ? "#b71c1c" : "#9e9e9e",
                    mb: 2,
                  }}
                />
                <Typography variant="h6">{c.title}</Typography>
                <Typography sx={{ mt: 1 }}>{c.unlockCondition}</Typography>
                {unlocked && (
                  <Typography sx={{ mt: 1, fontWeight: 700, color: "#d32f2f" }}>
                    Unlocked!
                  </Typography>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 6, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="caption">
          © 2025 LifeShare, All rights reserved!!
        </Typography>
      </Box>
    </Container>
  );
}
