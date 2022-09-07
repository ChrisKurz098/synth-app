import { useState } from 'react';
import './App.css';

let audioCtx
try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
}catch (e) {
  alert('Web Audio API is not supported in this browser');
}

const sinOsc = audioCtx.createOscillator();
const sinGain = audioCtx.createGain();
sinOsc.connect(sinGain);
sinGain.connect(audioCtx.destination);
sinOsc.type = 'sine';
sinOsc.start();

function App() {

const [sinState, setSinState] = useState({freq: 400, res: 0, gain:.3, tune: 0, GA: 0, GD: 1, GS: .2, GR: .5});

sinGain.gain.value = 0;
sinOsc.frequency.value = sinState.freq;

console.log(sinState, sinOsc.frequency.value)

const playSin = () => {
  audioCtx.resume();
  const {gain, GA, GD, GS} = sinState;
  sinGain.gain.cancelScheduledValues(audioCtx.currentTime);
  sinGain.gain.linearRampToValueAtTime(gain, audioCtx.currentTime+GA); //attack time to value
  sinGain.gain.linearRampToValueAtTime(GS, audioCtx.currentTime+GD); //decay time to value sustain
}
const releaseSin = () => {
  const {GR} = sinState;
  sinGain.gain.cancelScheduledValues(0);
  sinGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+GR); //release time to 0 gain
}

const changeSin = (e) => {
  setSinState(old => ({...old, [e.target.id]: parseFloat(e.target.value)}));
  }


  return (
    <div className="App">
<button onMouseDown={() => playSin()}  onMouseUp={() => releaseSin()}>Play</button>

<input id="freq" type="range" min={1} max={2000} value={sinState.freq} onChange={changeSin}/>
<input id="GA" className='ADSR' type="range" min={0} max={5} step="0.01" value={sinState.GA} onChange={changeSin}/>
<input id="GD" className='ADSR' type="range" min={0} max={5} step="0.01" value={sinState.GD} onChange={changeSin}/>
<input id="GS" className='ADSR' type="range" min={0} max={1} step="0.01" value={sinState.GS} onChange={changeSin}/>
<input id="GR" className='ADSR' type="range" min={0} max={5} step="0.01" value={sinState.GR} onChange={changeSin}/>
    </div>
  );
}

export default App;
