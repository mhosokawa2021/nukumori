//DOM
const kick = document.querySelector('#kick');
const snare = document.querySelector('#snare');
const hihat = document.querySelector('#hihat');

//シンセ生成
const membrane = new Tone.MembraneSynth().toMaster();
const noise = new Tone.NoiseSynth().toMaster();
const metal = new Tone.MetalSynth().toMaster();

kick.addEventListener('click', () => { 
 membrane.triggerAttackRelease('C0','4n'); 
}, false);

snare.addEventListener('click', () => { 
 noise.triggerAttackRelease('8n');  
}, false);

hihat.addEventListener('click', () => { 
 metal.triggerAttackRelease('32n'); 
}, false);