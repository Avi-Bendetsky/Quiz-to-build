import { Controller, Get, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('dashboard')
@SkipThrottle()
export class DashboardController {
    @Get()
    userDashboard(@Res() res: Response): void {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Quiz2Biz</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
        }
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.5em;
            font-weight: bold;
            color: #667eea;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .user-name {
            font-weight: 500;
        }
        .btn-logout {
            padding: 8px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-logout:hover {
            background: #d32f2f;
        }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .welcome {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 30px;
        }
        .welcome h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .welcome p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }
        .stat-card .number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
        }
        .section {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .section h2 {
            margin-bottom: 20px;
            color: #333;
        }
        .questionnaire-list {
            display: grid;
            gap: 15px;
        }
        .questionnaire-card {
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        .questionnaire-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102,126,234,0.2);
        }
        .questionnaire-info h3 {
            color: #333;
            margin-bottom: 5px;
        }
        .questionnaire-info p {
            color: #666;
            font-size: 0.9em;
        }
        .btn-primary {
            padding: 10px 25px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }
        .empty-state svg {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">Quiz2Biz</div>
        <div class="user-info">
            <span class="user-name" id="userName">Loading...</span>
            <button class="btn-logout" onclick="logout()">Logout</button>
        </div>
    </nav>

    <div class="container">
        <div class="welcome">
            <h1>Welcome back, <span id="welcomeName">User</span>!</h1>
            <p>Track your questionnaires, sessions, and documents</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <h3>Active Questionnaires</h3>
                <div class="number" id="activeCount">0</div>
            </div>
            <div class="stat-card">
                <h3>Sessions</h3>
                <div class="number" id="sessionCount">0</div>
            </div>
            <div class="stat-card">
                <h3>Generated Documents</h3>
                <div class="number" id="documentCount">0</div>
            </div>
        </div>

        <div class="section">
            <h2>📋 Available Questionnaires</h2>
            <div id="questionnairesList" class="loading">
                <div class="spinner"></div>
                <p>Loading questionnaires...</p>
            </div>
        </div>

        <div class="section">
            <h2>📊 Recent Sessions</h2>
            <div id="sessionsList" class="loading">
                <div class="spinner"></div>
                <p>Loading sessions...</p>
            </div>
        </div>

        <div class="section">
            <h2>📄 Generated Documents</h2>
            <div id="documentsList" class="loading">
                <div class="spinner"></div>
                <p>Loading documents...</p>
            </div>
        </div>
    </div>

    <script>
        const API_URL = window.location.origin + '/api/v1';
        let accessToken = localStorage.getItem('accessToken');

        // Check authentication
        if (!accessToken) {
            window.location.href = '/login';
        }

        // Load user info
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        document.getElementById('userName').textContent = user.name || 'User';
        document.getElementById('welcomeName').textContent = user.name?.split(' ')[0] || 'User';

        async function apiCall(endpoint) {
            const response = await fetch(API_URL + endpoint, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            if (response.status === 401) {
                logout();
                return null;
            }

            const data = await response.json();
            return data.success ? data.data : null;
        }

        async function loadQuestionnaires() {
            try {
                const questionnaires = await apiCall('/questionnaire');
                const container = document.getElementById('questionnairesList');
                
                if (!questionnaires || questionnaires.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No questionnaires available yet</p></div>';
                    return;
                }

                document.getElementById('activeCount').textContent = questionnaires.length;

                container.innerHTML = '<div class="questionnaire-list">' +
                    questionnaires.map(q => \`
                        <div class="questionnaire-card">
                            <div class="questionnaire-info">
                                <h3>\${q.title}</h3>
                                <p>\${q.description || 'No description'}</p>
                            </div>
                            <button class="btn-primary" onclick="startQuestionnaire('\${q.id}')">
                                Start
                            </button>
                        </div>
                    \`).join('') +
                    '</div>';
            } catch (error) {
                document.getElementById('questionnairesList').innerHTML = 
                    '<div class="empty-state"><p>Failed to load questionnaires</p></div>';
            }
        }

        async function loadSessions() {
            try {
                const sessions = await apiCall('/session');
                const container = document.getElementById('sessionsList');
                
                if (!sessions || sessions.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No sessions yet. Start a questionnaire to create one!</p></div>';
                    return;
                }

                document.getElementById('sessionCount').textContent = sessions.length;

                container.innerHTML = '<div class="questionnaire-list">' +
                    sessions.map(s => \`
                        <div class="questionnaire-card">
                            <div class="questionnaire-info">
                                <h3>Session #\${s.id.slice(0, 8)}</h3>
                                <p>Status: \${s.status} • Progress: \${s.progress || 0}%</p>
                            </div>
                            <button class="btn-primary" onclick="resumeSession('\${s.id}')">
                                Resume
                            </button>
                        </div>
                    \`).join('') +
                    '</div>';
            } catch (error) {
                document.getElementById('sessionsList').innerHTML = 
                    '<div class="empty-state"><p>Failed to load sessions</p></div>';
            }
        }

        async function loadDocuments() {
            try {
                const documents = await apiCall('/document-generator');
                const container = document.getElementById('documentsList');
                
                if (!documents || documents.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No documents generated yet</p></div>';
                    return;
                }

                document.getElementById('documentCount').textContent = documents.length;

                container.innerHTML = '<div class="questionnaire-list">' +
                    documents.map(d => \`
                        <div class="questionnaire-card">
                            <div class="questionnaire-info">
                                <h3>\${d.name || 'Document'}</h3>
                                <p>Created: \${new Date(d.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button class="btn-primary" onclick="downloadDocument('\${d.id}')">
                                Download
                            </button>
                        </div>
                    \`).join('') +
                    '</div>';
            } catch (error) {
                document.getElementById('documentsList').innerHTML = 
                    '<div class="empty-state"><p>Failed to load documents</p></div>';
            }
        }

        function startQuestionnaire(id) {
            alert('Starting questionnaire: ' + id);
            // TODO: Navigate to questionnaire page
        }

        function resumeSession(id) {
            alert('Resuming session: ' + id);
            // TODO: Navigate to session page
        }

        function downloadDocument(id) {
            alert('Downloading document: ' + id);
            // TODO: Implement download
        }

        function logout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Load all data
        loadQuestionnaires();
        loadSessions();
        loadDocuments();
    </script>
</body>
</html>
        `);
    }
}
