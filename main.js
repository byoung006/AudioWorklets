const audioContext = new window.AudioContext();
window.addEventListener("load", async () => {
  console.log("onload");
  const meterEl = document.getElementById("gain");
  const buttonEl = document.getElementById("start-button");
  meterEl.disabled = false;
  buttonEl.disabled = false;
  buttonEl.addEventListener("click", async () => {
    audioContext.resume();
    try {
      await startAudio(audioContext, meterEl);
    } catch (e) {
      console.error(e, "error");
    }
  });
});

async function startAudio(audioContext, meterElement) {
 console.log(audioContext,  'are we getting this') 
try {  
 await audioContext.audioWorklet.addModule("audio-volume-processor.js");
} catch (e) {
  console.error(e, 'error adding module')

}
 const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const volumeMeterNode = new AudioWorkletNode(
    audioContext,
    "average-volume-processor"
  );
  volumeMeterNode.port.onmessage = ({ data }) => {
    meterElement.value = data * 500;
    setInterval(() => {
    if (meterElement.value < 10) {
      console.log("Volume is too low", meterElement.value);    
    }
  }, 1000); 
  }

  const micNode = audioContext.createMediaStreamSource(mediaStream);
  micNode.connect(volumeMeterNode).connect(audioContext.destination);
}
