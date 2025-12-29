import { Box, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          GRC Platform
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Governance, Risk, and Compliance Management
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Frontend is ready. Start building!
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
