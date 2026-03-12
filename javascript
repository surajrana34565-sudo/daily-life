// Timer state
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const display = document.getElementById('timerDisplay');
    if (display) {
        display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Start timer
window.startTimer = function() {
    if (timerRunning) return;
    
    timerRunning = true;
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerRunning = false;
            alert('✅ Time is up! Take a short break.');
            
            // Play sound if available
            if (document.getElementById('timerSound')) {
                document.getElementById('timerSound').play();
            }
        }
    }, 1000);
};

// Pause timer
window.pauseTimer = function() {
    clearInterval(timerInterval);
    timerRunning = false;
};

// Reset timer
window.resetTimer = function() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
};

// Set custom timer
window.setTimer = function(minutes) {
    pauseTimer();
    timerSeconds = minutes * 60;
    updateTimerDisplay();
};

// Log study session
window.logStudySession = function() {
    const studiedMinutes = 25 - Math.floor(timerSeconds / 60);
    
    if (studiedMinutes > 0) {
        const today = new Date().toISOString().split('T')[0];
        
        AppState.data.studySessions = AppState.data.studySessions || [];
        AppState.data.studySessions.push({
            date: today,
            duration: studiedMinutes
        });
        
        saveState();
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `✅ Logged ${studiedMinutes} minutes of study!`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
        
        // Update stats
        if (typeof updateStats === 'function') {
            updateStats();
        }
    }
    
    resetTimer();
};
