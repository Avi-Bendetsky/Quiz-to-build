'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    LinearProgress,
    Skeleton,
    Avatar,
    Divider,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Add as AddIcon,
    PlayArrow as PlayArrowIcon,
    Description as DescriptionIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuthStore, api } from '@/lib';
import { format } from 'date-fns';

interface Session {
    id: string;
    questionnaire: {
        id: string;
        name: string;
    };
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    progress: {
        percentage: number;
        answered: number;
        total: number;
    };
    startedAt: string;
    completedAt?: string;
}

interface Questionnaire {
    id: string;
    name: string;
    description?: string;
    estimatedTime?: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [sessionsData, questionnairesData] = await Promise.all([
                    api.getSessions(),
                    api.getQuestionnaires(),
                ]);
                setSessions(sessionsData);
                setQuestionnaires(questionnairesData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, router]);

    const handleStartQuestionnaire = async (questionnaireId: string) => {
        try {
            const session = await api.startSession(questionnaireId);
            router.push(`/questionnaire/${session.id}`);
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    };

    const handleContinueSession = (sessionId: string) => {
        router.push(`/questionnaire/${sessionId}`);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'primary';
            case 'ABANDONED':
                return 'error';
            default:
                return 'default';
        }
    };

    if (!isAuthenticated) {
        return null;
    }

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
                    <Box>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                                {user?.name?.[0] || user?.email?.[0] || 'U'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem disabled>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {user?.name || 'User'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {user?.email}
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                                Sign Out
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Welcome Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Welcome back, {user?.name || 'there'}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Continue working on your business plans or start a new questionnaire.
                    </Typography>
                </Box>

                {/* Available Questionnaires */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                        Start New Questionnaire
                    </Typography>
                    {loading ? (
                        <Grid container spacing={3}>
                            {[1, 2].map((i) => (
                                <Grid item xs={12} sm={6} key={i}>
                                    <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={3}>
                            {questionnaires.map((questionnaire) => (
                                <Grid item xs={12} sm={6} md={4} key={questionnaire.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <DescriptionIcon color="primary" />
                                                <Typography variant="h6" fontWeight={600}>
                                                    {questionnaire.name}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {questionnaire.description || 'Complete this questionnaire to generate your business documentation.'}
                                            </Typography>
                                            {questionnaire.estimatedTime && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        ~{questionnaire.estimatedTime} minutes
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                fullWidth
                                                onClick={() => handleStartQuestionnaire(questionnaire.id)}
                                            >
                                                Start New
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* Recent Sessions */}
                <Box>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                        Your Sessions
                    </Typography>
                    {loading ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3].map((i) => (
                                <Grid item xs={12} key={i}>
                                    <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : sessions.length === 0 ? (
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No sessions yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Start a questionnaire above to begin creating your business documentation.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Grid container spacing={2}>
                            {sessions.map((session) => (
                                <Grid item xs={12} key={session.id}>
                                    <Card>
                                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {session.questionnaire.name}
                                                    </Typography>
                                                    <Chip
                                                        label={session.status.replace('_', ' ')}
                                                        color={getStatusColor(session.status) as any}
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Started: {format(new Date(session.startedAt), 'MMM d, yyyy')}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Progress: {session.progress.answered} / {session.progress.total} questions
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={session.progress.percentage}
                                                    sx={{ mt: 2, height: 6, borderRadius: 1 }}
                                                />
                                            </Box>
                                            {session.status === 'IN_PROGRESS' && (
                                                <Button
                                                    variant="contained"
                                                    startIcon={<PlayArrowIcon />}
                                                    onClick={() => handleContinueSession(session.id)}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                            {session.status === 'COMPLETED' && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<DescriptionIcon />}
                                                    onClick={() => router.push(`/documents?sessionId=${session.id}`)}
                                                >
                                                    View Documents
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
