// State management
const appState = {
    token: null,
    user: null,
    repos: [],
    selectedRepo: null,
    selectedProvider: 'vercel',
    domain: '',
    deploymentResult: null
};

// DOM Elements
const elements = {
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    step4: document.getElementById('step4'),
    step5: document.getElementById('step5'),
    results: document.getElementById('results'),
    githubLogin: document.getElementById('github-login'),
    reposList: document.getElementById('repos-list'),
    reposLoading: document.getElementById('repos-loading'),
    deployBtn: document.getElementById('deploy-btn'),
    projectName: document.getElementById('project-name'),
    domainText: document.getElementById('domain-text'),
    fullUrl: document.getElementById('full-url'),
    summaryRepo: document.getElementById('summary-repo'),
    summaryProvider: document.getElementById('summary-provider'),
    summaryDomain: document.getElementById('summary-domain'),
    liveUrl: document.getElementById('live-url'),
    deployStatus: document.getElementById('deploy-status'),
    deployTime: document.getElementById('deploy-time')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check for existing token
    const token = localStorage.getItem('github_token');
    if (token) {
        appState.token = token;
        showStep(2);
        loadRepositories();
    }
    
    // Set default provider
    updateProviderSelection('vercel');
    
    // Update domain preview
    updateDomainPreview();
}

function setupEventListeners() {
    // GitHub login
    elements.githubLogin.addEventListener('click', githubLogin);
    
    // Provider selection
    document.querySelectorAll('.provider-card').forEach(card => {
        card.addEventListener('click', () => {
            const provider = card.dataset.provider;
            updateProviderSelection(provider);
            updateDomainPreview();
        });
    });
    
    // Project name input
    elements.projectName.addEventListener('input', updateDomainPreview);
    
    // Auto-update summary
    elements.projectName.addEventListener('input', updateDeploySummary);
}

// GitHub OAuth Flow
function githubLogin() {
    // For GitHub Pages, we'll use GitHub's API directly
    // This is a simplified version - in production, you'd need a backend
    
    const clientId = 'YOUR_GITHUB_CLIENT_ID'; // You'll need to create a GitHub OAuth App
    const redirectUri = window.location.origin;
    const scope = 'repo user';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    // Store current state to verify later
    localStorage.setItem('oauth_state', Math.random().toString(36).substring(2));
    
    window.location.href = authUrl;
}

// Load repositories
async function loadRepositories() {
    try {
        elements.reposLoading.style.display = 'block';
        elements.reposList.style.display = 'none';
        
        // Using GitHub REST API
        const response = await fetch('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${appState.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to load repositories');
        
        const repos = await response.json();
        appState.repos = repos;
        
        displayRepositories(repos);
        
        elements.reposLoading.style.display = 'none';
        elements.reposList.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        elements.reposLoading.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load repositories. Please try again.</p>
                <button onclick="loadRepositories()" class="btn-secondary">Retry</button>
            </div>
        `;
    }
}

function displayRepositories(repos) {
    elements.reposList.innerHTML = '';
    
    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repo-item';
        repoElement.innerHTML = `
            <div class="repo-info">
                <i class="fab fa-github"></i>
                <div>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description'}</p>
                    <div class="repo-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span class="repo-visibility ${repo.private ? 'private' : 'public'}">
                            <i class="fas fa-${repo.private ? 'lock' : 'globe'}"></i>
                            ${repo.private ? 'Private' : 'Public'}
                        </span>
                    </div>
                </div>
            </div>
            <button class="select-repo-btn" onclick="selectRepository('${repo.full_name}')">
                <i class="fas fa-check"></i> Select
            </button>
        `;
        elements.reposList.appendChild(repoElement);
    });
}

function selectRepository(fullName) {
    const repo = appState.repos.find(r => r.full_name === fullName);
    if (!repo) return;
    
    appState.selectedRepo = repo;
    
    // Update project name if empty
    if (!elements.projectName.value) {
        elements.projectName.value = repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        updateDomainPreview();
    }
    
    // Show next step
    showStep(3);
    
    // Update UI
    document.querySelectorAll('.repo-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.closest('.repo-item').classList.add('selected');
    
    updateDeploySummary();
}

function updateProviderSelection(provider) {
    appState.selectedProvider = provider;
    
    // Update UI
    document.querySelectorAll('.provider-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.provider === provider) {
            card.classList.add('selected');
        }
    });
    
    updateDeploySummary();
}

function updateDomainPreview() {
    const projectName = elements.projectName.value.trim() || 'my-project';
    const cleanName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    const domains = {
        vercel: `${cleanName}.vercel.app`,
        netlify: `${cleanName}.netlify.app`,
        github: `${cleanName}.github.io`
    };
    
    const domain = domains[appState.selectedProvider] || domains.vercel;
    appState.domain = domain;
    
    elements.domainText.textContent = domain;
    elements.fullUrl.textContent = `https://${domain}`;
    
    updateDeploySummary();
}

function updateDeploySummary() {
    elements.summaryRepo.textContent = appState.selectedRepo 
        ? appState.selectedRepo.full_name 
        : 'Not selected';
    
    elements.summaryProvider.textContent = appState.selectedProvider.charAt(0).toUpperCase() + 
                                          appState.selectedProvider.slice(1);
    
    elements.summaryDomain.textContent = appState.domain;
}

async function startDeployment() {
    if (!appState.selectedRepo) {
        alert('Please select a repository first');
        return;
    }
    
    // Update button state
    const originalText = elements.deployBtn.innerHTML;
    elements.deployBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deploying...';
    elements.deployBtn.disabled = true;
    
    try {
        // Simulate deployment (in production, this would call your backend)
        await simulateDeployment();
        
        // Show success
        showStep(6);
        
        // Update results
        elements.liveUrl.href = `https://${appState.domain}`;
        elements.liveUrl.textContent = `https://${appState.domain}`;
        elements.deployStatus.textContent = 'Ready';
        elements.deployTime.textContent = new Date().toLocaleTimeString();
        
    } catch (error) {
        console.error('Deployment failed:', error);
        alert('Deployment failed. Please try again.');
    } finally {
        // Reset button
        elements.deployBtn.innerHTML = originalText;
        elements.deployBtn.disabled = false;
    }
}

function simulateDeployment() {
    return new Promise((resolve) => {
        // Simulate API calls
        setTimeout(() => {
            // In a real app, you would:
            // 1. Call Vercel/Netlify API to create project
            // 2. Set up GitHub webhook for auto-deploy
            // 3. Configure domain
            // 4. Return deployment URL
            
            resolve({
                success: true,
                url: `https://${appState.domain}`,
                status: 'ready'
            });
        }, 3000);
    });
}

function showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= 6; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) step.style.display = 'none';
    }
    
    // Show current step
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.style.display = 'block';
        
        // Special handling for results
        if (stepNumber === 6) {
            elements.results.style.display = 'block';
        }
    }
    
    // Update stats bar
    document.querySelectorAll('.stat').forEach((stat, index) => {
        if (index < stepNumber - 1) {
            stat.style.borderColor = 'var(--primary)';
            stat.style.opacity = '1';
        } else {
            stat.style.borderColor = 'var(--border)';
            stat.style.opacity = index === stepNumber - 1 ? '1' : '0.6';
        }
    });
}

function copyDomain() {
    const domain = `https://${appState.domain}`;
    navigator.clipboard.writeText(domain).then(() => {
        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    });
}

function visitSite() {
    window.open(`https://${appState.domain}`, '_blank');
}

function viewLogs() {
    // In production, this would show deployment logs
    alert('Logs would be shown here. In production, this would connect to the deployment provider API.');
}

function deployAgain() {
    // Reset and start over
    appState.selectedRepo = null;
    appState.domain = '';
    elements.projectName.value = '';
    showStep(2);
    elements.results.style.display = 'none';
}

function filterRepos(type) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Filter repositories
    let filteredRepos = appState.repos;
    
    if (type === 'public') {
        filteredRepos = appState.repos.filter(repo => !repo.private);
    } else if (type === 'private') {
        filteredRepos = appState.repos.filter(repo => repo.private);
    }
    
    displayRepositories(filteredRepos);
}

// OAuth callback handler (for GitHub Pages)
function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code && state === localStorage.getItem('oauth_state')) {
        // Exchange code for token (requires backend)
        // For GitHub Pages, we'll use a proxy or alternative method
        console.log('OAuth code received:', code);
        
        // Clear OAuth params from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Call this on page load
handleOAuthCallback();
