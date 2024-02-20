// Create me an audio worklet processor that will find the average volume of its inputs
const SMOOTHING_FACTOR = 0.9;
const FRAME_PER_SECOND = 60;
const FRAME_INTERVAL = 1 / FRAME_PER_SECOND;

registerProcessor("average-volume-processor",class extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "gain",
        defaultValue: 0.5,
        minValue: -1,
        maxValue: 1,
      },
    ];
  }
  constructor(inputs, outputs, parameters) {
    super();
    this._lastUpdate = currentTime;
    this._volume = 0;
  }
  calculateRMS(inputChannelData) {
    // Calculate the squared-sum.
    let sum = 0;
    for (let i = 0; i < inputChannelData.length; i++) {
      sum += inputChannelData[i] * inputChannelData[i];
    }
    // Calculate the RMS level and update the volume.
    let rms = Math.sqrt(sum / inputChannelData.length);
    this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);
    // Calculate the average volume every 5 seconds and log to the console if it's too low.
  }

  process(inputs, outputs) {
    const inputChannelData = inputs[0][0];
    if (currentTime - this._lastUpdate > FRAME_INTERVAL) {
      this.calculateRMS(inputChannelData);
      this.port.postMessage(this._volume);
      this._lastUpdate = currentTime;
    }

    return true;
  }
}
);
