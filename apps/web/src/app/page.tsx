'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    title: 'Adaptive Questionnaires',
    description: 'Smart questions that adapt based on your answers to gather exactly what you need.',
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
    title: 'Auto-Generated Documents',
    description: 'Instantly create CTO specs, business plans, and BA requirements from your responses.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Quick Turnaround',
    description: 'Get comprehensive business documentation in minutes, not weeks.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Enterprise Security',
    description: 'Your data is protected with industry-leading security standards.',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: 'Readiness Scoring',
    description: 'Track your business readiness with our intelligent scoring engine.',
  },
  {
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    title: 'Multi-Persona Support',
    description: 'Generate documents tailored for CTO, CFO, BA, and SEO stakeholders.',
  },
];

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} color="primary.main">
              Quiz2Biz
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} href="/login" variant="text">
              Sign In
            </Button>
            <Button component={Link} href="/register" variant="contained">
              Get Started Free
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Transform Your Business Ideas
            <br />
            Into Actionable Plans
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Our intelligent questionnaire platform helps you create comprehensive
            business documentation in minutes, not weeks.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Free Trial
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={700}
            sx={{ mb: 6 }}
          >
            Everything You Need to Plan Your Business
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 8,
            px: 4,
            my: 8,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of businesses already using Quiz2Biz
          </Typography>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Create Free Account
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 4, mt: 8 }}>
        <Container>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2026 Quiz2Biz. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
