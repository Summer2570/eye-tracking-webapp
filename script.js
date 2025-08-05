const video = document.getElementById("video");
const statusText = document.getElementById("status");

// โหลดโมเดล FaceAPI
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models"),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models"),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("กล้องไม่ทำงาน", err);
      statusText.innerText = "❌ ไม่สามารถเข้าถึงกล้อง";
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true);

    const resized = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);

    if (detections.length > 0) {
      statusText.innerText = "✅ กำลังโฟกัสและอ่านอยู่";
      statusText.style.color = "green";
    } else {
      statusText.innerText = "❌ ไม่พบใบหน้า";
      statusText.style.color = "red";
    }
  }, 500);
});
