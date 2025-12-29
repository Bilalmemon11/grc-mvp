import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import axios from 'axios';

interface Framework {
  id: string;
  name: string;
  version: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    controls: number;
  };
}

const Frameworks: React.FC = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const response = await axios.get('/frameworks');
        if (response.data.success) {
          setFrameworks(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load frameworks');
      } finally {
        setLoading(false);
      }
    };

    fetchFrameworks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Compliance Frameworks
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Manage and view your compliance frameworks and controls
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Framework</strong></TableCell>
              <TableCell><strong>Version</strong></TableCell>
              <TableCell><strong>Controls</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {frameworks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    No frameworks found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              frameworks.map((framework) => (
                <TableRow key={framework.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {framework.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {framework.description?.substring(0, 100)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{framework.version}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${framework._count.controls} controls`}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={framework.isActive ? 'Active' : 'Inactive'}
                      color={framework.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => alert(`Viewing controls for ${framework.name} (Coming soon)`)}
                    >
                      View Controls
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {frameworks.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>NIST CSF 2.0 Imported:</strong> The NIST Cybersecurity Framework 2.0 has been successfully imported with {frameworks[0]?._count.controls} controls organized across 6 functions and 23 categories.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Frameworks;
