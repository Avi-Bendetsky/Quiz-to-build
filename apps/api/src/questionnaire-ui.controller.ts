import { Controller, Get, Param, Res, Req, UseGuards, Render } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller('questionnaire')
@UseGuards(JwtAuthGuard)
export class QuestionnaireUIController {
    /**
     * Serve the interactive questionnaire UI
     * This page provides a one-question-per-page experience with progress tracking
     */
    @Get(':id/start')
    startQuestionnaire(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const user = req.user as any;

        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Startup Incubator - Questionnaire</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        .header {
            background: white;
            padding: 20px 30px;
            border-radius: 12px 12px 0 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header h1 {
            color: #2d3748;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .progress-container {
            background: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 15px;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
            width: 0%;
        }

        .progress-text {
            font-size: 14px;
            color: #718096;
            margin-top: 8px;
        }

        .sidebar {
            background: white;
            padding: 20px;
            border-radius: 0 0 12px 12px;
            margin-top: 2px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-list {
            list-style: none;
        }

        .section-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            transition: background 0.2s;
        }

        .section-item:hover {
            background: #f7fafc;
        }

        .section-item.active {
            background: #edf2f7;
            border-left: 3px solid #667eea;
        }

        .section-item.completed {
            opacity: 0.7;
        }

        .section-icon {
            font-size: 20px;
            margin-right: 12px;
        }

        .section-name {
            flex: 1;
            font-weight: 500;
            color: #2d3748;
        }

        .section-status {
            font-size: 18px;
        }

        .question-card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            margin-top: 20px;
            min-height: 500px;
            display: flex;
            flex-direction: column;
        }

        .question-header {
            margin-bottom: 30px;
        }

        .question-number {
            color: #667eea;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .question-text {
            font-size: 22px;
            color: #2d3748;
            margin-top: 10px;
            line-height: 1.4;
        }

        .question-help {
            color: #718096;
            font-size: 14px;
            margin-top: 10px;
            display: flex;
            align-items: center;
        }

        .help-icon {
            margin-right: 6px;
        }

        .question-body {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-text, .input-textarea {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
            font-family: inherit;
        }

        .input-text:focus, .input-textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .input-textarea {
            min-height: 150px;
            resize: vertical;
        }

        .options-list {
            list-style: none;
        }

        .option-item {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: flex-start;
        }

        .option-item:hover {
            border-color: #667eea;
            background: #edf2f7;
        }

        .option-item.selected {
            border-color: #667eea;
            background: #edf2f7;
        }

        .option-radio {
            margin-right: 14px;
            margin-top: 2px;
        }

        .option-content {
            flex: 1;
        }

        .option-label {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 4px;
        }

        .option-description {
            font-size: 14px;
            color: #718096;
        }

        .option-icon {
            font-size: 24px;
            margin-left: 12px;
        }

        .navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
        }

        .btn {
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            display: inline-flex;
            align-items: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }

        .btn-secondary:hover {
            background: #f7fafc;
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #718096;
        }

        .error {
            background: #fed7d7;
            color: #742a2a;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .validation-error {
            color: #e53e3e;
            font-size: 14px;
            margin-top: 8px;
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
            }

            .question-card {
                padding: 24px;
            }

            .question-text {
                font-size: 18px;
            }

            .navigation {
                flex-direction: column;
                gap: 12px;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 id="questionnaire-title">Business Startup Incubator</h1>
            <div class="progress-container">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <div class="progress-text" id="progress-text">Starting...</div>
        </div>

        <div class="sidebar">
            <h3 style="margin-bottom: 16px; color: #2d3748;">Sections</h3>
            <ul class="section-list" id="section-list">
                <!-- Sections will be populated here -->
            </ul>
        </div>

        <div class="question-card">
            <div id="question-container">
                <div class="loading">
                    <p>Loading questionnaire...</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api/v1';
        const QUESTIONNAIRE_ID = '${id}';
        let currentSession = null;
        let currentQuestion = null;
        let sections = [];

        // Initialize questionnaire
        async function init() {
            try {
                // Start a new session
                const response = await fetch(\`\${API_BASE}/sessions/start/\${QUESTIONNAIRE_ID}\`, {
                    method: 'POST'
                });

                if (!response.ok) throw new Error('Failed to start session');

                const data = await response.json();
                currentSession = data.data;

                // Load sections
                await loadSections();

                // Load first question
                await loadNextQuestion();
            } catch (error) {
                showError('Failed to initialize questionnaire: ' + error.message);
            }
        }

        async function loadSections() {
            try {
                const response = await fetch(\`\${API_BASE}/questionnaires/\${QUESTIONNAIRE_ID}\`);
                if (!response.ok) throw new Error('Failed to load sections');

                const data = await response.json();
                sections = data.data.sections;

                renderSections();
            } catch (error) {
                console.error('Failed to load sections:', error);
            }
        }

        function renderSections() {
            const sectionList = document.getElementById('section-list');
            sectionList.innerHTML = sections.map((section, index) => \`
                <li class="section-item" id="section-\${section.id}">
                    <span class="section-icon">\${section.icon || '📋'}</span>
                    <span class="section-name">\${section.name}</span>
                    <span class="section-status">⏳</span>
                </li>
            \`).join('');
        }

        async function loadNextQuestion() {
            try {
                const response = await fetch(\`\${API_BASE}/sessions/\${currentSession.id}/continue?count=1\`);
                if (!response.ok) throw new Error('Failed to load question');

                const data = await response.json();
                
                if (data.data.hasNextQuestion) {
                    currentQuestion = data.data.nextQuestions[0];
                    renderQuestion(currentQuestion, data.data.currentSectionIndex, data.data.overallProgress);
                    updateProgress(data.data.overallProgress);
                } else {
                    showCompletion();
                }
            } catch (error) {
                showError('Failed to load question: ' + error.message);
            }
        }

        function renderQuestion(question, sectionIndex, progress) {
            const container = document.getElementById('question-container');
            
            container.innerHTML = \`
                <div class="question-header">
                    <div class="question-number">Question \${Math.floor(progress.answeredCount + 1)} of \${progress.totalCount}</div>
                    <h2 class="question-text">\${question.text}</h2>
                    \${question.helpText ? \`
                        <div class="question-help">
                            <span class="help-icon">💡</span>
                            <span>\${question.helpText}</span>
                        </div>
                    \` : ''}
                    <div id="error-message"></div>
                </div>
                <div class="question-body">
                    <div class="input-group" id="input-container">
                        \${renderInput(question)}
                    </div>
                </div>
                <div class="navigation">
                    <button class="btn btn-secondary" onclick="saveDraft()">
                        💾 Save & Continue Later
                    </button>
                    <button class="btn btn-primary" onclick="submitAnswer()" id="next-btn">
                        Next →
                    </button>
                </div>
            \`;
        }

        function renderInput(question) {
            switch (question.type) {
                case 'TEXT':
                    return \`
                        <input 
                            type="text" 
                            class="input-text" 
                            id="answer-input"
                            placeholder="\${question.placeholder || 'Enter your answer...'}"
                            \${question.isRequired ? 'required' : ''}
                        />
                    \`;

                case 'LONG_TEXT':
                    return \`
                        <textarea 
                            class="input-textarea" 
                            id="answer-input"
                            placeholder="\${question.placeholder || 'Enter your detailed answer...'}"
                            \${question.isRequired ? 'required' : ''}
                        ></textarea>
                    \`;

                case 'SINGLE_CHOICE':
                    return \`
                        <ul class="options-list">
                            \${(question.options || []).map(opt => \`
                                <li class="option-item" onclick="selectOption('\${opt.id}', false)">
                                    <input 
                                        type="radio" 
                                        name="answer" 
                                        value="\${opt.id}" 
                                        id="opt-\${opt.id}"
                                        class="option-radio"
                                    />
                                    <div class="option-content">
                                        <div class="option-label">\${opt.label}</div>
                                        \${opt.description ? \`<div class="option-description">\${opt.description}</div>\` : ''}
                                    </div>
                                    \${opt.icon ? \`<span class="option-icon">\${opt.icon}</span>\` : ''}
                                </li>
                            \`).join('')}
                        </ul>
                    \`;

                case 'MULTI_CHOICE':
                    return \`
                        <ul class="options-list">
                            \${(question.options || []).map(opt => \`
                                <li class="option-item" onclick="selectOption('\${opt.id}', true)">
                                    <input 
                                        type="checkbox" 
                                        name="answer" 
                                        value="\${opt.id}" 
                                        id="opt-\${opt.id}"
                                        class="option-radio"
                                    />
                                    <div class="option-content">
                                        <div class="option-label">\${opt.label}</div>
                                        \${opt.description ? \`<div class="option-description">\${opt.description}</div>\` : ''}
                                    </div>
                                    \${opt.icon ? \`<span class="option-icon">\${opt.icon}</span>\` : ''}
                                </li>
                            \`).join('')}
                        </ul>
                    \`;

                case 'DATE':
                    return \`
                        <input 
                            type="date" 
                            class="input-text" 
                            id="answer-input"
                            \${question.isRequired ? 'required' : ''}
                        />
                    \`;

                default:
                    return \`<p>Unsupported question type: \${question.type}</p>\`;
            }
        }

        function selectOption(optionId, isMulti) {
            const checkbox = document.getElementById('opt-' + optionId);
            const item = checkbox.closest('.option-item');

            if (isMulti) {
                checkbox.checked = !checkbox.checked;
                item.classList.toggle('selected', checkbox.checked);
            } else {
                // Deselect all other options
                document.querySelectorAll('.option-item').forEach(el => {
                    el.classList.remove('selected');
                    el.querySelector('input').checked = false;
                });
                checkbox.checked = true;
                item.classList.add('selected');
            }
        }

        async function submitAnswer() {
            try {
                const answer = getAnswerValue();

                if (!validateAnswer(answer)) {
                    return;
                }

                // Submit response
                const response = await fetch(\`\${API_BASE}/sessions/\${currentSession.id}/responses\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        questionId: currentQuestion.id,
                        value: answer
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to submit answer');
                }

                // Load next question
                await loadNextQuestion();
            } catch (error) {
                showError('Failed to submit answer: ' + error.message);
            }
        }

        function getAnswerValue() {
            const inputEl = document.getElementById('answer-input');
            
            if (inputEl) {
                return inputEl.value;
            }

            // For multiple choice
            const checked = Array.from(document.querySelectorAll('input[name="answer"]:checked'));
            if (currentQuestion.type === 'MULTI_CHOICE') {
                return checked.map(el => el.value);
            } else {
                return checked[0]?.value || null;
            }
        }

        function validateAnswer(answer) {
            const errorEl = document.getElementById('error-message');
            errorEl.innerHTML = '';

            if (currentQuestion.isRequired && (!answer || (Array.isArray(answer) && answer.length === 0))) {
                errorEl.innerHTML = '<div class="error">This question is required</div>';
                return false;
            }

            return true;
        }

        async function saveDraft() {
            try {
                alert('Your progress has been saved! You can continue later from your dashboard.');
                window.location.href = '/dashboard';
            } catch (error) {
                showError('Failed to save: ' + error.message);
            }
        }

        function updateProgress(progress) {
            const percentage = (progress.answeredCount / progress.totalCount) * 100;
            document.getElementById('progress-bar').style.width = percentage + '%';
            document.getElementById('progress-text').textContent = 
                \`\${progress.answeredCount} of \${progress.totalCount} questions answered (\${Math.round(percentage)}%)\`;
        }

        function showCompletion() {
            const container = document.getElementById('question-container');
            container.innerHTML = \`
                <div style="text-align: center; padding: 60px 20px;">
                    <h2 style="font-size: 32px; margin-bottom: 20px;">🎉 Congratulations!</h2>
                    <p style="font-size: 18px; color: #718096; margin-bottom: 30px;">
                        You've completed the questionnaire. Your responses have been saved.
                    </p>
                    <button class="btn btn-primary" onclick="window.location.href='/dashboard'">
                        Go to Dashboard
                    </button>
                </div>
            \`;
        }

        function showError(message) {
            const container = document.getElementById('question-container');
            container.innerHTML = \`
                <div class="error">
                    <strong>Error:</strong> \${message}
                </div>
                <button class="btn btn-secondary" onclick="init()" style="margin-top: 20px;">
                    Try Again
                </button>
            \`;
        }

        // Initialize on load
        init();
    </script>
</body>
</html>
    `);
    }
}
