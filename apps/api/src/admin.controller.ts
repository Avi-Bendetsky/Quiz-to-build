import { Controller, Get, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('admin')
@SkipThrottle()
export class AdminController {
    @Get('dashboard')
    adminDashboard(@Res() res: Response): void {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Quiz2Biz</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            display: flex;
            min-height: 100vh;
        }
        .sidebar {
            width: 250px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 0;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
        }
        .sidebar-logo {
            font-size: 1.8em;
            font-weight: bold;
            text-align: center;
            margin-bottom: 40px;
        }
        .sidebar-menu {
            list-style: none;
        }
        .sidebar-menu li {
            padding: 15px 30px;
            cursor: pointer;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .sidebar-menu li:hover,
        .sidebar-menu li.active {
            background: rgba(255,255,255,0.2);
        }
        .main-content {
            margin-left: 250px;
            flex: 1;
            padding: 30px;
        }
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .navbar h1 {
            color: #333;
            font-size: 1.8em;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .admin-badge {
            background: #ff9800;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
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
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        .section-header h2 {
            color: #333;
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
        .btn-secondary {
            padding: 8px 20px;
            background: #4caf50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            margin-left: 10px;
        }
        .btn-secondary:hover {
            background: #45a049;
        }
        .btn-danger {
            padding: 8px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            margin-left: 10px;
        }
        .btn-danger:hover {
            background: #d32f2f;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            text-align: left;
            padding: 15px;
            background: #f5f7fa;
            color: #666;
            font-weight: 600;
            border-bottom: 2px solid #e0e0e0;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
        }
        tr:hover {
            background: #f9f9f9;
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
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }
        .role-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .role-admin { background: #ffe0b2; color: #e65100; }
        .role-client { background: #e3f2fd; color: #1565c0; }
        .role-super { background: #f3e5f5; color: #6a1b9a; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-logo">Quiz2Biz</div>
        <ul class="sidebar-menu">
            <li class="active" onclick="showSection('overview')">📊 Overview</li>
            <li onclick="showSection('questionnaires')">📋 Questionnaires</li>
            <li onclick="showSection('users')">👥 Users</li>
            <li onclick="showSection('sessions')">📈 Sessions</li>
            <li onclick="showSection('documents')">📄 Documents</li>
            <li onclick="showSection('standards')">⚙️ Standards</li>
        </ul>
    </div>

    <div class="main-content">
        <nav class="navbar">
            <h1>Admin Dashboard</h1>
            <div class="user-info">
                <span class="admin-badge">ADMIN</span>
                <span id="adminName">Loading...</span>
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
        </nav>

        <div id="overviewSection">
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <div class="number" id="totalUsers">0</div>
                </div>
                <div class="stat-card">
                    <h3>Questionnaires</h3>
                    <div class="number" id="totalQuestionnaires">0</div>
                </div>
                <div class="stat-card">
                    <h3>Active Sessions</h3>
                    <div class="number" id="totalSessions">0</div>
                </div>
                <div class="stat-card">
                    <h3>Documents</h3>
                    <div class="number" id="totalDocuments">0</div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h2>📊 System Overview</h2>
                </div>
                <p>Welcome to the Quiz2Biz Admin Dashboard. Use the sidebar to manage questionnaires, users, and system settings.</p>
            </div>
        </div>

        <div id="questionnairesSection" class="section" style="display: none;">
            <div class="section-header">
                <h2>📋 Manage Questionnaires</h2>
                <button class="btn-primary" onclick="createQuestionnaire()">+ New Questionnaire</button>
            </div>
            <div id="questionnairesList" class="loading">
                <div class="spinner"></div>
                <p>Loading questionnaires...</p>
            </div>
        </div>

        <div id="usersSection" class="section" style="display: none;">
            <div class="section-header">
                <h2>👥 Manage Users</h2>
                <button class="btn-primary" onclick="createUser()">+ New User</button>
            </div>
            <div id="usersList" class="loading">
                <div class="spinner"></div>
                <p>Loading users...</p>
            </div>
        </div>

        <div id="sessionsSection" class="section" style="display: none;">
            <div class="section-header">
                <h2>📈 Active Sessions</h2>
            </div>
            <div id="sessionsList" class="loading">
                <div class="spinner"></div>
                <p>Loading sessions...</p>
            </div>
        </div>

        <div id="documentsSection" class="section" style="display: none;">
            <div class="section-header">
                <h2>📄 Generated Documents</h2>
            </div>
            <div id="documentsList" class="loading">
                <div class="spinner"></div>
                <p>Loading documents...</p>
            </div>
        </div>

        <div id="standardsSection" class="section" style="display: none;">
            <div class="section-header">
                <h2>⚙️ Standards Library</h2>
                <button class="btn-primary" onclick="createStandard()">+ New Standard</button>
            </div>
            <div id="standardsList" class="loading">
                <div class="spinner"></div>
                <p>Loading standards...</p>
            </div>
        </div>
    </div>

    <script>
        const API_URL = window.location.origin + '/api/v1';
        let accessToken = localStorage.getItem('accessToken');

        // Check authentication and role
        if (!accessToken) {
            window.location.href = '/login';
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            alert('Access denied. Admin privileges required.');
            window.location.href = '/dashboard';
        }

        document.getElementById('adminName').textContent = user.name || 'Admin';

        async function apiCall(endpoint, method = 'GET', body = null) {
            const options = {
                method,
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(API_URL + endpoint, options);

            if (response.status === 401) {
                logout();
                return null;
            }

            const data = await response.json();
            return data.success ? data.data : null;
        }

        function showSection(section) {
            // Hide all sections
            document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
            document.getElementById('overviewSection').style.display = 'none';
            document.getElementById('questionnairesSection').style.display = 'none';
            document.getElementById('usersSection').style.display = 'none';
            document.getElementById('sessionsSection').style.display = 'none';
            document.getElementById('documentsSection').style.display = 'none';
            document.getElementById('standardsSection').style.display = 'none';

            // Show selected section
            event.target.classList.add('active');
            if (section === 'overview') {
                document.getElementById('overviewSection').style.display = 'block';
            } else {
                document.getElementById(section + 'Section').style.display = 'block';
                // Load section data
                if (section === 'questionnaires') loadQuestionnaires();
                if (section === 'users') loadUsers();
                if (section === 'sessions') loadSessions();
                if (section === 'documents') loadDocuments();
                if (section === 'standards') loadStandards();
            }
        }

        async function loadStats() {
            try {
                const [users, questionnaires, sessions, documents] = await Promise.all([
                    apiCall('/admin/users'),
                    apiCall('/admin/questionnaire'),
                    apiCall('/admin/session'),
                    apiCall('/admin/document-generator')
                ]);

                document.getElementById('totalUsers').textContent = users?.length || 0;
                document.getElementById('totalQuestionnaires').textContent = questionnaires?.length || 0;
                document.getElementById('totalSessions').textContent = sessions?.length || 0;
                document.getElementById('totalDocuments').textContent = documents?.length || 0;
            } catch (error) {
                console.error('Failed to load stats', error);
            }
        }

        async function loadQuestionnaires() {
            try {
                const questionnaires = await apiCall('/admin/questionnaire');
                const container = document.getElementById('questionnairesList');
                
                if (!questionnaires || questionnaires.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No questionnaires yet. Create your first one!</p></div>';
                    return;
                }

                container.innerHTML = \`
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${questionnaires.map(q => \`
                                <tr>
                                    <td><strong>\${q.title}</strong></td>
                                    <td>\${q.description || 'No description'}</td>
                                    <td>\${new Date(q.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn-secondary" onclick="editQuestionnaire('\${q.id}')">Edit</button>
                                        <button class="btn-danger" onclick="deleteQuestionnaire('\${q.id}')">Delete</button>
                                    </td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;
            } catch (error) {
                document.getElementById('questionnairesList').innerHTML = 
                    '<div class="empty-state"><p>Failed to load questionnaires</p></div>';
            }
        }

        async function loadUsers() {
            try {
                const users = await apiCall('/admin/users');
                const container = document.getElementById('usersList');
                
                if (!users || users.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No users found</p></div>';
                    return;
                }

                container.innerHTML = \`
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${users.map(u => \`
                                <tr>
                                    <td><strong>\${u.name}</strong></td>
                                    <td>\${u.email}</td>
                                    <td><span class="role-badge role-\${u.role.toLowerCase()}">\${u.role}</span></td>
                                    <td>\${new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn-secondary" onclick="editUser('\${u.id}')">Edit</button>
                                        <button class="btn-danger" onclick="deleteUser('\${u.id}')">Delete</button>
                                    </td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;
            } catch (error) {
                document.getElementById('usersList').innerHTML = 
                    '<div class="empty-state"><p>Failed to load users</p></div>';
            }
        }

        async function loadSessions() {
            const container = document.getElementById('sessionsList');
            container.innerHTML = '<div class="empty-state"><p>Sessions management coming soon</p></div>';
        }

        async function loadDocuments() {
            const container = document.getElementById('documentsList');
            container.innerHTML = '<div class="empty-state"><p>Documents management coming soon</p></div>';
        }

        async function loadStandards() {
            const container = document.getElementById('standardsList');
            container.innerHTML = '<div class="empty-state"><p>Standards management coming soon</p></div>';
        }

        function createQuestionnaire() {
            alert('Create questionnaire dialog coming soon');
        }

        function editQuestionnaire(id) {
            alert('Edit questionnaire: ' + id);
        }

        function deleteQuestionnaire(id) {
            if (confirm('Are you sure you want to delete this questionnaire?')) {
                alert('Delete questionnaire: ' + id);
            }
        }

        function createUser() {
            alert('Create user dialog coming soon');
        }

        function editUser(id) {
            alert('Edit user: ' + id);
        }

        function deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                alert('Delete user: ' + id);
            }
        }

        function createStandard() {
            alert('Create standard dialog coming soon');
        }

        function logout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Load initial stats
        loadStats();
    </script>
</body>
</html>
        `);
    }
}
