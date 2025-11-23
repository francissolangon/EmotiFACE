const startBtn = document.getElementById('startBtn');
const webcamPlaceholder = document.querySelector('.webcam-placeholder');
const webcamVideo = document.getElementById('webcam');

let dummyCanvas, dummyCtx;
let detectionInterval, emotionInterval;
let running = false;

startBtn.addEventListener('click', async () => {
  if (!running) {
    startBtn.textContent = 'Stop Detection';
    startBtn.classList.replace('btn-primary', 'btn-danger');
    webcamPlaceholder.textContent = '🎥 Activating webcam...';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamVideo.srcObject = stream;
      webcamVideo.style.display = 'block';
      webcamPlaceholder.style.display = 'none';

      setupDummyCanvas();
      startDummyDetection();
      running = true;
    } catch (err) {
      webcamPlaceholder.textContent = '⚠️ Unable to access webcam.';
    }
  } else {
    stopDummyDetection();
  }
});

function setupDummyCanvas() {
  dummyCanvas = document.createElement('canvas');
  dummyCanvas.id = 'overlay';
  dummyCanvas.width = webcamVideo.offsetWidth;
  dummyCanvas.height = webcamVideo.offsetHeight;
  dummyCanvas.style.position = 'absolute';
  dummyCanvas.style.top = webcamVideo.offsetTop + 'px';
  dummyCanvas.style.left = webcamVideo.offsetLeft + 'px';
  dummyCanvas.style.zIndex = 2;
  document.querySelector('.webcam-frame').appendChild(dummyCanvas);
  dummyCtx = dummyCanvas.getContext('2d');
}

function startDummyDetection() {
const emotions = ['HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'NEUTRAL', 'FEAR', 'DISGUST'];
  let currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];

  //Map emotions to emoji + text
  const emotionMap = {
    HAPPY: { emoji: "😄", msg: "Yay! Everyone looks happy!" },
    SAD: { emoji: "😢", msg: "Oh no, someone’s feeling down." },
    ANGRY: { emoji: "😠", msg: "Hmm, I sense some anger — deep breaths!" },
    SURPRISED: { emoji: "😲", msg: "Whoa! Something surprising happened!" },
    NEUTRAL: { emoji: "😐", msg: "All calm and neutral now." },
    FEAR: { emoji: "😨", msg: "Some fear detected — let’s stay calm!" },
    DISGUST: { emoji: "🤢", msg: "Ew, something’s off!" }
  };

  const mascotFace = document.getElementById('mascotFace');
  const mascotMsg = document.getElementById('mascotMsg');

  // Center box position
  let w = 200, h = 200;
  let x = (dummyCanvas.width / 2) - w / 2;
  let y = (dummyCanvas.height / 2) - h / 2;

 
  emotionInterval = setInterval(() => {
    currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    updateMascot(currentEmotion); //sync mascot with emotion
  }, 5000);

  // Draw box every frame
  detectionInterval = setInterval(() => {
    if (!dummyCtx) return;
    dummyCtx.clearRect(0, 0, dummyCanvas.width, dummyCanvas.height);

    // Gentle random movement
    x += Math.random() * 4 - 2;
    y += Math.random() * 4 - 2;
    x = Math.max(0, Math.min(x, dummyCanvas.width - w));
    y = Math.max(0, Math.min(y, dummyCanvas.height - h));

    // Glowing box
    dummyCtx.lineWidth = 4;
    dummyCtx.strokeStyle = '#00C4B3';
    dummyCtx.shadowColor = '#00C4B3';
    dummyCtx.shadowBlur = 15;
    dummyCtx.strokeRect(x, y, w, h);

    // Label background
    dummyCtx.shadowBlur = 0;
    dummyCtx.fillStyle = '#00C4B3';
    dummyCtx.fillRect(x, y - 40, 160, 35);

    // Emotion text
    dummyCtx.fillStyle = '#fff';
    dummyCtx.font = 'bold 28px Baloo 2';
    dummyCtx.fillText(currentEmotion.toUpperCase(), x + 10, y - 15);
  }, 100);

  //Initial mascot emotion
  updateMascot(currentEmotion);

  function updateMascot(emotion) {
    if (emotionMap[emotion]) {
      mascotFace.textContent = emotionMap[emotion].emoji;
      mascotMsg.textContent = emotionMap[emotion].msg;
    }
  }
}

function stopDummyDetection() {
  startBtn.textContent = 'Start Detection';
  startBtn.classList.replace('btn-danger', 'btn-primary');
  webcamPlaceholder.style.display = 'flex';
  webcamPlaceholder.textContent = '🎥 Webcam stream';
  webcamVideo.style.display = 'none';
  if (webcamVideo.srcObject) {
    webcamVideo.srcObject.getTracks().forEach(track => track.stop());
  }
  if (dummyCanvas) dummyCanvas.remove();
  clearInterval(detectionInterval);
  clearInterval(emotionInterval);
  running = false;
}
