const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');

let isProgrammaticSeek = false;

videoInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        videoPreview.src = fileURL;
        videoPreview.style.display = 'block';
    }
});

const saveButton = document.getElementById('saveButton');
const notepad = document.getElementById('notepad');

saveButton.addEventListener('click', function() {
    const textToSave = notepad.value;
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'notepad.txt';
    link.href = window.URL.createObjectURL(blob);
    link.click();
    window.URL.revokeObjectURL(link.href);
});

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
}

function insertTimestamp(time) {
    const timestampText = `[${time}] `;
    notepad.value += timestampText;
    notepad.focus();
}

videoPreview.addEventListener('seeked', function() {
    if (isProgrammaticSeek) {
        isProgrammaticSeek = false;
    } else {
        const currentTime = videoPreview.currentTime;
        const formattedTime = formatTime(currentTime);
        insertTimestamp(formattedTime);
    }
});

document.addEventListener('keydown', function(event) {
    if (videoPreview.readyState >= 1) {
        const key = event.key;

        if (key === 'ArrowLeft') {
            isProgrammaticSeek = true; 
            videoPreview.currentTime = Math.max(0, videoPreview.currentTime - 3);
            event.preventDefault(); 
        } else if (key === 'ArrowRight') {
            isProgrammaticSeek = true; 
            videoPreview.currentTime = Math.min(videoPreview.duration, videoPreview.currentTime + 3);
            event.preventDefault(); 
        }
    }
});
