'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormGroup,
    LinearProgress,
    AppBar,
    Toolbar,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress,
    Chip,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Save as SaveIcon,
    Business as BusinessIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { api, useAuthStore } from '@/lib';

interface Question {
    id: string;
    text: string;
    type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'EMAIL' | 'URL' | 'DATE' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE';
    helpText?: string;
    placeholder?: string;
    isRequired: boolean;
    options?: Array<{ id: string; label: string; description?: string }>;
    validationRules?: Record<string, unknown>;
}

interface Section {
    id: string;
    name: string;
    description?: string;
    orderIndex: number;
}

interface Session {
    id: string;
    questionnaire: {
        id: string;
        name: string;
        sections: Section[];
    };
    status: string;
    progress: {
        percentage: number;
        answered: number;
        total: number;
    };
    currentSectionId?: string;
}

export default function QuestionnairePage() {
    const router = useRouter();
    const params = useParams();
    const sessionId = params.id as string;
    const { isAuthenticated } = useAuthStore();

    const [session, setSession] = useState<Session | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState<string | string[]>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const loadNextQuestion = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.getNextQuestions(sessionId, 1);

            if (response.questions && response.questions.length > 0) {
                setCurrentQuestion(response.questions[0]);
                setAnswer('');
                setSession(response.session);
            } else if (response.isComplete) {
                setIsComplete(true);
            }
        } catch (err) {
            console.error('Failed to load question:', err);
            setError('Failed to load the next question. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const initSession = async () => {
            try {
                const sessionData = await api.getSession(sessionId);
                setSession(sessionData);

                if (sessionData.status === 'COMPLETED') {
                    setIsComplete(true);
                    setLoading(false);
                } else {
                    await loadNextQuestion();
                }
            } catch (err) {
                console.error('Failed to load session:', err);
                setError('Failed to load the questionnaire session.');
                setLoading(false);
            }
        };

        initSession();
    }, [isAuthenticated, router, sessionId, loadNextQuestion]);

    const handleSubmitAnswer = async () => {
        if (!currentQuestion) return;

        // Validation
        if (currentQuestion.isRequired && !answer) {
            setError('This question requires an answer.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await api.submitResponse(sessionId, currentQuestion.id, answer);
            await loadNextQuestion();
        } catch (err) {
            console.error('Failed to submit answer:', err);
            setError('Failed to save your answer. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkip = async () => {
        if (currentQuestion?.isRequired) {
            setError('This question is required and cannot be skipped.');
            return;
        }
        await loadNextQuestion();
    };

    const handleSaveAndExit = async () => {
        router.push('/dashboard');
    };

    const handleComplete = async () => {
        try {
            await api.completeSession(sessionId);
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to complete session:', err);
        }
    };

    const renderInput = () => {
        if (!currentQuestion) return null;

        switch (currentQuestion.type) {
            case 'TEXT':
            case 'EMAIL':
            case 'URL':
            case 'NUMBER':
                return (
                    <TextField
                        fullWidth
                        type={currentQuestion.type.toLowerCase()}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        helperText={currentQuestion.helpText}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                );

            case 'TEXTAREA':
                return (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        helperText={currentQuestion.helpText}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                );

            case 'DATE':
                return (
                    <TextField
                        fullWidth
                        type="date"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        helperText={currentQuestion.helpText}
                        variant="outlined"
                        sx={{ mt: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                );

            case 'SINGLE_CHOICE':
                return (
                    <RadioGroup
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        {currentQuestion.options?.map((option) => (
                            <Card
                                key={option.id}
                                sx={{
                                    mb: 1,
                                    cursor: 'pointer',
                                    border: answer === option.id ? 2 : 1,
                                    borderColor: answer === option.id ? 'primary.main' : 'divider',
                                    '&:hover': { borderColor: 'primary.light' },
                                }}
                                onClick={() => setAnswer(option.id)}
                            >
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <FormControlLabel
                                        value={option.id}
                                        control={<Radio />}
                                        label={
                                            <Box>
                                                <Typography fontWeight={500}>{option.label}</Typography>
                                                {option.description && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {option.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        sx={{ width: '100%', m: 0 }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </RadioGroup>
                );

            case 'MULTIPLE_CHOICE':
                const selectedOptions = Array.isArray(answer) ? answer : [];
                return (
                    <FormGroup sx={{ mt: 2 }}>
                        {currentQuestion.options?.map((option) => (
                            <Card
                                key={option.id}
                                sx={{
                                    mb: 1,
                                    cursor: 'pointer',
                                    border: selectedOptions.includes(option.id) ? 2 : 1,
                                    borderColor: selectedOptions.includes(option.id) ? 'primary.main' : 'divider',
                                    '&:hover': { borderColor: 'primary.light' },
                                }}
                                onClick={() => {
                                    const newSelection = selectedOptions.includes(option.id)
                                        ? selectedOptions.filter((id) => id !== option.id)
                                        : [...selectedOptions, option.id];
                                    setAnswer(newSelection);
                                }}
                            >
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={selectedOptions.includes(option.id)} />
                                        }
                                        label={
                                            <Box>
                                                <Typography fontWeight={500}>{option.label}</Typography>
                                                {option.description && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {option.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        sx={{ width: '100%', m: 0 }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </FormGroup>
                );

            default:
                return (
                    <TextField
                        fullWidth
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        helperText={currentQuestion.helpText}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                );
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    // Completion Screen
    if (isComplete) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                Quiz2Biz
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm" sx={{ py: 8 }}>
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Congratulations!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            You have completed the questionnaire. Your responses have been saved and
                            you can now generate your business documents.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleComplete}
                            >
                                Go to Dashboard
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}
            <AppBar position="static" elevation={0}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            Quiz2Biz
                        </Typography>
                    </Box>
                    <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveAndExit}
                        color="inherit"
                    >
                        Save & Exit
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Progress Bar */}
            <Box sx={{ bgcolor: 'background.paper', py: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progress
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {session?.progress.answered || 0} / {session?.progress.total || 0} questions
                        </Typography>
                        <Chip
                            label={`${session?.progress.percentage || 0}%`}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={session?.progress.percentage || 0}
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                </Container>
            </Box>

            {/* Question Content */}
            <Container maxWidth="md" sx={{ py: 6 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : currentQuestion ? (
                    <Card sx={{ p: 4 }}>
                        {/* Question Header */}
                        <Box sx={{ mb: 4 }}>
                            {currentQuestion.isRequired && (
                                <Chip label="Required" size="small" color="error" sx={{ mb: 2 }} />
                            )}
                            <Typography variant="h5" fontWeight={600}>
                                {currentQuestion.text}
                            </Typography>
                            {currentQuestion.helpText && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {currentQuestion.helpText}
                                </Typography>
                            )}
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {/* Question Input */}
                        {renderInput()}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                variant="text"
                                onClick={handleSkip}
                                disabled={currentQuestion.isRequired || submitting}
                            >
                                Skip
                            </Button>
                            <Button
                                variant="contained"
                                endIcon={submitting ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                                onClick={handleSubmitAnswer}
                                disabled={submitting}
                                size="large"
                            >
                                {submitting ? 'Saving...' : 'Next'}
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Alert severity="info">
                        No more questions available. Click below to complete the questionnaire.
                        <Button onClick={handleComplete} sx={{ ml: 2 }}>
                            Complete
                        </Button>
                    </Alert>
                )}
            </Container>
        </Box>
    );
}
