import { Controller, Get, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller()
@SkipThrottle()
export class PagesController {
    @Get('login')
    loginPage(@Res() res: Response): void {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Quiz2Biz</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 450px;
            padding: 50px 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 5px;
        }
        .logo p {
            color: #666;
            font-size: 0.9em;
        }
        .form-group {
            margin-bottom: 25px;
        }
        label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95em;
        }
        input {
            width: 100%;
            padding: 14px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            transition: all 0.3s ease;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }
        .btn {
            width: 100%;
            padding: 14px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        .btn:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }
        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        .alert-error {
            background: #fee;
            color: #c33;
            border: 1px solid #fcc;
        }
        .alert-success {
            background: #efe;
            color: #3c3;
            border: 1px solid #cfc;
        }
        .links {
            text-align: center;
            margin-top: 25px;
        }
        .links a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .links a:hover {
            text-decoration: underline;
        }
        .divider {
            text-align: center;
            margin: 20px 0;
            color: #999;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>Quiz2Biz</h1>
            <p>Sign in to your account</p>
        </div>

        <div id="alert" class="alert"></div>

        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required autocomplete="email">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn" id="submitBtn">
                Sign In
            </button>
        </form>

        <div class="links">
            <a href="/register">Don't have an account? Register</a>
            <div class="divider">•</div>
            <a href="/">Back to Home</a>
        </div>
    </div>

    <script>
        const API_URL = window.location.origin + '/api/v1';
        
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        const alertDiv = document.getElementById('alert');

        function showAlert(message, type = 'error') {
            alertDiv.textContent = message;
            alertDiv.className = 'alert alert-' + type;
            alertDiv.style.display = 'block';
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 5000);
        }

        function setLoading(loading) {
            submitBtn.disabled = loading;
            submitBtn.innerHTML = loading ? '<span class="spinner"></span>Signing in...' : 'Sign In';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading(true);
            alertDiv.style.display = 'none';

            try {
                const response = await fetch(API_URL + '/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Store tokens
                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify(data.data.user));

                    showAlert('Login successful! Redirecting...', 'success');

                    // Redirect based on role
                    setTimeout(() => {
                        const role = data.data.user.role;
                        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                            window.location.href = '/admin/dashboard';
                        } else {
                            window.location.href = '/dashboard';
                        }
                    }, 1000);
                } else {
                    showAlert(data.message || 'Invalid credentials. Please try again.');
                }
            } catch (error) {
                showAlert('Connection error. Please check your internet connection.');
            } finally {
                setLoading(false);
            }
        });
    </script>
</body>
</html>
        `);
    }

    @Get('register')
    registerPage(@Res() res: Response): void {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Quiz2Biz</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 450px;
            padding: 50px 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 5px;
        }
        .logo p {
            color: #666;
            font-size: 0.9em;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95em;
        }
        input {
            width: 100%;
            padding: 14px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            transition: all 0.3s ease;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }
        .password-strength {
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }
        .password-strength-bar {
            height: 100%;
            width: 0%;
            transition: all 0.3s ease;
        }
        .strength-weak { background: #f44336; width: 33%; }
        .strength-medium { background: #ff9800; width: 66%; }
        .strength-strong { background: #4caf50; width: 100%; }
        .btn {
            width: 100%;
            padding: 14px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        .btn:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }
        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        .alert-error {
            background: #fee;
            color: #c33;
            border: 1px solid #fcc;
        }
        .alert-success {
            background: #efe;
            color: #3c3;
            border: 1px solid #cfc;
        }
        .links {
            text-align: center;
            margin-top: 25px;
        }
        .links a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .links a:hover {
            text-decoration: underline;
        }
        .divider {
            text-align: center;
            margin: 20px 0;
            color: #999;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>Quiz2Biz</h1>
            <p>Create your account</p>
        </div>

        <div id="alert" class="alert"></div>

        <form id="registerForm">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required autocomplete="name">
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required autocomplete="email">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required minlength="12" autocomplete="new-password">
                <div class="password-strength">
                    <div class="password-strength-bar" id="strengthBar"></div>
                </div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password">
            </div>

            <button type="submit" class="btn" id="submitBtn">
                Create Account
            </button>
        </form>

        <div class="links">
            <a href="/login">Already have an account? Sign in</a>
            <div class="divider">•</div>
            <a href="/">Back to Home</a>
        </div>
    </div>

    <script>
        const API_URL = window.location.origin + '/api/v1';
        
        const form = document.getElementById('registerForm');
        const submitBtn = document.getElementById('submitBtn');
        const alertDiv = document.getElementById('alert');
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('strengthBar');

        function showAlert(message, type = 'error') {
            alertDiv.textContent = message;
            alertDiv.className = 'alert alert-' + type;
            alertDiv.style.display = 'block';
        }

        function setLoading(loading) {
            submitBtn.disabled = loading;
            submitBtn.innerHTML = loading ? '<span class="spinner"></span>Creating account...' : 'Create Account';
        }

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            let strength = 0;
            
            if (password.length >= 12) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;

            strengthBar.className = 'password-strength-bar';
            if (strength >= 4) strengthBar.classList.add('strength-strong');
            else if (strength >= 2) strengthBar.classList.add('strength-medium');
            else if (strength >= 1) strengthBar.classList.add('strength-weak');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showAlert('Passwords do not match');
                return;
            }

            if (password.length < 12) {
                showAlert('Password must be at least 12 characters');
                return;
            }

            setLoading(true);
            alertDiv.style.display = 'none';

            try {
                const response = await fetch(API_URL + '/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showAlert('Account created successfully! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showAlert(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                showAlert('Connection error. Please check your internet connection.');
            } finally {
                setLoading(false);
            }
        });
    </script>
</body>
</html>
        `);
    }
}
