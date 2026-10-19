// Jay's birthday experience — customize the notes and photo captions below.
const $ = (selector) => document.querySelector(selector);
const scenes = [...document.querySelectorAll(".scene")];

function showScene(id) {
  scenes.forEach(scene => scene.classList.toggle("active", scene.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2800);
}

let candleDone = false;
let audioContext = null;
let micStream = null;
let micAnimation = null;

function blowOutCandle() {
  if (candleDone) return;
  candleDone = true;
  stopMic();
  const cake = document.querySelector(".cake");
  cake.classList.add("candle-out");
  const smoke = document.createElement("div");
  smoke.className = "smoke";
  cake.appendChild(smoke);
  $("#blowInstruction").textContent = "Wish made. Let the birthday magic begin…";
  $("#blowButton").disabled = true;
  $("#micButton").disabled = true;
  setTimeout(() => showScene("envelopeScene"), 1700);
}

$("#blowButton").addEventListener("click", blowOutCandle);

// Optional microphone blow detection. A button is always available as a fallback.
$("#micButton").addEventListener("click", async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    toast("Microphone isn't available here — tap the candle button instead.");
    return;
  }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(micStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    $("#micStatus").textContent = "Listening… give the candle a little puff of air.";
    $("#micButton").textContent = "Listening for your wish…";
    let loudFrames = 0;
    const listen = () => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += Math.abs(sample - 128);
      const average = sum / samples.length;
      loudFrames = average > 12 ? loudFrames + 1 : Math.max(0, loudFrames - 1);
      if (loudFrames > 5) { blowOutCandle(); return; }
      micAnimation = requestAnimationFrame(listen);
    };
    listen();
  } catch (error) {
    $("#micStatus").textContent = "No worries — tap the candle button instead.";
    toast("Microphone permission wasn't available. The button still works!");
  }
});

function stopMic() {
  if (micAnimation) cancelAnimationFrame(micAnimation);
  if (micStream) micStream.getTracks().forEach(track => track.stop());
  if (audioContext && audioContext.state !== "closed") audioContext.close();
  micStream = null;
  audioContext = null;
}

// Envelope animation, then reveal the card.
$("#openEnvelope").addEventListener("click", () => {
  const envelope = $(".envelope");
  envelope.classList.add("opening");
  setTimeout(() => {
    showScene("cardScene");
    startPhotoShow();
  }, 850);
});

// Replace these filenames with your own. Add matching images inside /photos.
const photos = [
  { file: "photos/photo1.jpg", caption: "my favorite kind of day" },
  { file: "photos/photo2.jpg", caption: "a memory I keep close" },
  { file: "photos/photo3.jpg", caption: "you make me smile" },
  { file: "photos/photo4.jpg", caption: "just us ♡" },
  { file: "photos/photo5.jpg", caption: "mr. and mrs goofy" },
  { file: "photos/photo6.jpg", caption: "sunsets with my boy" },
  { file: "photos/photo7.jpg", caption: "forever celebrating you" },
  { file: "photos/photo8.png", caption: "my fav ice-cream date" }



];
let photoIndex = 0;
let photoTimer = null;
const image = $("#memoryPhoto");
const placeholder = $("#photoPlaceholder");

function renderPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  image.classList.remove("loaded");
  image.onload = () => {
    image.classList.add("loaded");
    placeholder.classList.add("hidden");
  };
  image.onerror = () => {
    image.classList.remove("loaded");
    placeholder.classList.remove("hidden");
  };
  image.src = photo.file;
  image.alt = photo.caption;
  $("#photoCaption").textContent = photo.caption;
  $("#photoCount").textContent = `${String(photoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  $("#photoDots").innerHTML = photos.map((_, i) => `<span class="${i === photoIndex ? "active" : ""}"></span>`).join("");
}

function startPhotoShow() {
  renderPhoto(photoIndex);
  clearInterval(photoTimer);
  photoTimer = setInterval(() => renderPhoto(photoIndex + 1), 4500);
}
$("#prevPhoto").addEventListener("click", () => { renderPhoto(photoIndex - 1); startPhotoTimerOnly(); });
$("#nextPhoto").addEventListener("click", () => { renderPhoto(photoIndex + 1); startPhotoTimerOnly(); });
function startPhotoTimerOnly() {
  clearInterval(photoTimer);
  photoTimer = setInterval(() => renderPhoto(photoIndex + 1), 4500);
}

// Little notes — edit these messages to make them personal and specific.
const notes = {
  admire: {
    title: "Something I admire about you",
    body: "I admire the way you keep learning, growing, and working toward the things that matter to you. I hope you give yourself credit for how far you've come. I'm proud of you. You really do inspire me to want more. Thank you my love ❤️."
  },
  memory: {
    title: "A memory I love",
    body: "One of my favorite memories of us is our trip to the Poconos! From riding 40 miles on bicycles and crying my eyes out near the end, to going whitewater rafting the next - we really made the most of that trip. 😂❤️ We had so much fun!!! I'm so excited for all the adventures we still have ahead of us — more traveling, more crying because of good movies, more food taste-testing, more exploring the outdoors, and probably more activities that leave us wondering what the hell we got ourselves into. 😂"
  },
  wish: {
    title: "A wish for your year",
    body: "I wish you a year filled with peace in your mind, confidence in yourself, breakthrough in your project, a Lando comeback 😌🤞, and people who show up for you the way you deserve. I hope you feel loved every day my pretty boy ❤️."
  },
  future: {
    title: "Something to look forward to",
    body: "More dates, more laughs, more tennis, more hot steamy sex 😏, more little traditions, and more memories we haven't made yet. let's go mannnnnnnnnn ♡"
  }
};

document.querySelectorAll(".note-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const note = notes[tile.dataset.note];
    $("#modalTitle").textContent = note.title;
    $("#modalBody").textContent = note.body;
    $("#noteModal").classList.add("open");
  });
});
function closeModal() { $("#noteModal").classList.remove("open"); }
$("#closeModal").addEventListener("click", closeModal);
$("#modalDone").addEventListener("click", closeModal);
$("#noteModal").addEventListener("click", event => {
  if (event.target === $("#noteModal")) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

$("#toNotes").addEventListener("click", () => showScene("notesScene"));
$("#toFinal").addEventListener("click", () => {
  showScene("finalScene");
  launchConfetti();
});

function launchConfetti() {
  const container = $("#confetti");
  container.innerHTML = "";
  for (let i = 0; i < 75; i++) {
    const bit = document.createElement("i");
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.animationDelay = `${Math.random() * 2.3}s`;
    bit.style.animationDuration = `${3 + Math.random() * 2.5}s`;
    bit.style.transform = `rotate(${Math.random() * 180}deg)`;
    container.appendChild(bit);
  }
}
$("#replay").addEventListener("click", () => {
  candleDone = false;
  stopMic();
  $(".cake").classList.remove("candle-out");
  $(".smoke")?.remove();
  $("#blowButton").disabled = false;
  $("#micButton").disabled = false;
  $("#micButton").textContent = "Use my microphone";
  $("#blowInstruction").textContent = "Make a wish, then blow out your candle.";
  $(".envelope").classList.remove("opening");
  clearInterval(photoTimer);
  showScene("cakeScene");
});

// Initial state
renderPhoto(0);
