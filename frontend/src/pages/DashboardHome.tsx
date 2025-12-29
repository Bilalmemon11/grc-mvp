import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assessment as FrameworkIcon,
  Security as RiskIcon,
  Assignment as AuditIcon,
  CheckCircle as ComplianceIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DashboardHome: React.FC = () => {
  const { user, roles } = useAuth();

  const stats = [
    { title: 'Frameworks', value: '1', icon: <FrameworkIcon fontSize="large" />, color: '#1976d2' },
    { title: 'Controls', value: '185', icon: <ComplianceIcon fontSize="large" />, color: '#2e7d32' },
    { title: 'Risks', value: '0', icon: <RiskIcon fontSize="large" />, color: '#ed6c02' },
    { title: 'Audits', value: '0', icon: <AuditIcon fontSize="large" />, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Role: {roles.join(', ') || 'No role assigned'}
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Start
            </Typography>
            <Typography variant="body2" paragraph>
              Welcome to the GRC Platform MVP! You now have access to:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  <strong>NIST CSF 2.0</strong> - 185 controls across 6 functions and 23 categories
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Frameworks</strong> - View and manage compliance frameworks
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Risk Management</strong> - Coming in Phase 2
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Audit Management</strong> - Coming in Phase 2
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Phase:</strong> 1 - Foundation
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Progress:</strong> 100%
            </Typography>
            <Typography variant="body2" color="success.main">
              All systems operational
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
