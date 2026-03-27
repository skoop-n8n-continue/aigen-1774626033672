const scheduleData = [
    { time: '07:00 AM', name: 'Sunrise Yoga', instructor: 'Sarah Miller' },
    { time: '08:30 AM', name: 'HIIT Intensity', instructor: 'Mike Johnson' },
    { time: '10:00 AM', name: 'Pilates Flow', instructor: 'Elena Rodriguez' },
    { time: '12:00 PM', name: 'Lunch Crunch', instructor: 'David Chen' },
    { time: '04:30 PM', name: 'Cardio Blast', instructor: 'Mike Johnson' },
    { time: '05:45 PM', name: 'Power Lifting', instructor: 'Chris Evans' },
    { time: '07:00 PM', name: 'Evening Stretch', instructor: 'Sarah Miller' }
];

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
}

function renderSchedule() {
    const container = document.getElementById('schedule-container');
    container.innerHTML = ''; // Clear loading

    const scheduleList = document.createElement('div');
    scheduleList.className = 'schedule-list';
    scheduleList.id = 'schedule-list';

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinutes;

    scheduleData.forEach(item => {
        const card = createClassCard(item, currentTimeVal);
        scheduleList.appendChild(card);
    });

    container.appendChild(scheduleList);

    // Check if we need to scroll
    setTimeout(() => {
        const containerHeight = container.offsetHeight;
        const listHeight = scheduleList.offsetHeight;

        if (listHeight > containerHeight) {
            // Duplicate list for seamless loop
            const clone = scheduleList.cloneNode(true);
            const scrollWrapper = document.createElement('div');
            scrollWrapper.className = 'scrolling-content';

            // Adjust animation duration based on content length
            const duration = (listHeight / 50); // 50px per second
            scrollWrapper.style.animationDuration = `${duration}s`;

            container.innerHTML = '';
            scrollWrapper.appendChild(scheduleList);
            scrollWrapper.appendChild(clone);
            container.appendChild(scrollWrapper);
        }
    }, 100);
}

function createClassCard(item, currentTimeVal) {
    const card = document.createElement('div');
    card.className = 'class-card';

    // Parse time to value for comparison
    const timeParts = item.time.match(/(\d+):(\d+)\s+(AM|PM)/);
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const ampm = timeParts[3];

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const classTimeVal = hours * 60 + minutes;

    // Highlight active/upcoming class
    // If class is within the next 30 mins or currently happening
    if (classTimeVal >= currentTimeVal - 15 && classTimeVal <= currentTimeVal + 45) {
        card.classList.add('active');
    }

    card.innerHTML = `
        <div class="class-time">${item.time}</div>
        <div class="class-name">${item.name}</div>
        <div class="class-instructor">
            <span class="instructor-label">Instructor</span>
            ${item.instructor}
        </div>
    `;

    return card;
}

// Initialize
updateDateTime();
renderSchedule();

// Update every minute
setInterval(updateDateTime, 1000);
// Refresh schedule every hour to update highlight
setInterval(renderSchedule, 3600000);
