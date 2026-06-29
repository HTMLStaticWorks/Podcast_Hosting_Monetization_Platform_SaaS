// Tab switching logic
function switchTab(sectionId) {
    // Deactivate all tabs
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Activate selected tab
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    const navItem = document.querySelector(`.sidebar-item[data-target="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        switchTab(target);
    });
});

// Custom Canvas Chart Engine
let currentChartMode = 'line'; // line or bar
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const dataValues = [6500, 18000, 32000, 24000, 85000, 142850];

function renderChart() {
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Make canvas responsive
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 50;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    const maxValue = Math.max(...dataValues) * 1.1;

    // Draw Y-Axis grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6b7280';
    ctx.font = '10px sans-serif';

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + (chartHeight * (1 - i / gridLines));
        const val = Math.round((maxValue * i) / gridLines);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Check text align for RTL
        const isRtl = document.body.getAttribute('dir') === 'rtl';
        if (isRtl) {
            ctx.fillText(val.toLocaleString(), canvas.width - padding + 10, y + 4);
        } else {
            ctx.fillText(val.toLocaleString(), 10, y + 4);
        }
    }

    const points = dataValues.map((val, index) => {
        const x = padding + (chartWidth * (index / (dataValues.length - 1)));
        const y = padding + chartHeight * (1 - (val / maxValue));
        return { x, y };
    });

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6366f1';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#ec4899';

    if (currentChartMode === 'line') {
        // Draw Fill Gradient
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        gradient.addColorStop(0, primaryColor + '40'); // 25% opacity
        gradient.addColorStop(1, primaryColor + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, canvas.height - padding);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
        ctx.closePath();
        ctx.fill();

        // Draw Line
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Draw Points
        points.forEach((p, i) => {
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    } else {
        // Draw Bar chart
        const barWidth = (chartWidth / dataValues.length) * 0.5;
        dataValues.forEach((val, i) => {
            const x = padding + (chartWidth * (i / (dataValues.length - 1))) - (barWidth / 2);
            const y = padding + chartHeight * (1 - (val / maxValue));
            const height = (canvas.height - padding) - y;

            const barGrad = ctx.createLinearGradient(x, y, x, y + height);
            barGrad.addColorStop(0, primaryColor);
            barGrad.addColorStop(1, secondaryColor);

            ctx.fillStyle = barGrad;
            // Draw rounded bar (or plain rectangle fallback)
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, [8, 8, 0, 0]);
            ctx.fill();
        });
    }

    // Draw X-Axis labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6b7280';
    ctx.textAlign = 'center';
    months.forEach((month, index) => {
        const x = padding + (chartWidth * (index / (months.length - 1)));
        ctx.fillText(month, x, canvas.height - 15);
    });
}

// Redraw chart when mode switches
function updateChartType(type) {
    currentChartMode = type;
    renderChart();
}

window.addEventListener('resize', renderChart);
document.addEventListener('DOMContentLoaded', () => {
    renderChart();
    // Re-render chart on theme changes or direction toggling to update coordinates and theme variables
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        setTimeout(renderChart, 350);
    });
    document.getElementById('rtl-toggle')?.addEventListener('click', () => {
        setTimeout(renderChart, 100);
    });
});

// Drag & Drop Upload Simulation
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const progressContainer = document.getElementById('upload-progress-container');
const progressBar = document.getElementById('upload-progress-bar');
const percentageText = document.getElementById('upload-percentage');
const statusText = document.getElementById('upload-status-text');
const aiTranscriptResult = document.getElementById('ai-transcription-result');

if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.background = 'var(--primary-light)';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border-color)';
        dropzone.style.background = 'none';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border-color)';
        dropzone.style.background = 'none';
        
        if (e.dataTransfer.files.length > 0) {
            simulateUpload(e.dataTransfer.files[0].name);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length > 0) {
            simulateUpload(fileInput.files[0].name);
        }
    });
}

function simulateUpload(filename) {
    progressContainer.style.display = 'block';
    aiTranscriptResult.style.display = 'none';
    progressBar.style.width = '0%';
    percentageText.textContent = '0%';
    statusText.textContent = `Uploading ${filename}...`;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            statusText.textContent = 'Upload Complete. Processing AI transcription...';
            progressBar.style.width = '100%';
            percentageText.textContent = '100%';
            
            // Simulate transcription generation after a small delay
            setTimeout(() => {
                statusText.textContent = 'Successfully Transcribed & Registered!';
                aiTranscriptResult.style.display = 'block';
            }, 1500);
        } else {
            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${progress}%`;
        }
    }, 200);
}

// Ad Insertion simulator
function insertAd(sponsorName) {
    const feedback = document.getElementById('ad-insert-feedback');
    if (feedback) {
        feedback.textContent = `Ad Spot by "${sponsorName}" successfully inserted into Ep 05!`;
        feedback.style.display = 'block';
        
        // Dynamically increment the CPM metric in dashboard stats
        const cpmEl = document.getElementById('stats-cpm');
        if (cpmEl) {
            cpmEl.textContent = '$148.20';
        }

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 4000);
    }
}
