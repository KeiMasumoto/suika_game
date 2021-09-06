
class AudioPlayer{
  constructor(){
    const bound = new Audio("bound","../audio/bound.mp3");
    const union = new Audio("union","../audio/union.mp3");
    this.data = [bound.data,union.data]
    this.audioContext = new AudioContext();
    window.AudioContext = window.AudioContext || window.webkitAudioContext; //互換対応
  }

  playSound(name){//音の再生が単発の再生
    let dir = null;
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].name === name){
        dir = this.data[i].dir;
      }
    }
    let src = null;
    const audioPlayer = this;
    fetch(dir, {method:"GET",}).then(response => response.arrayBuffer()).then(arrayBuffer => {
      const res = arrayBuffer;
      audioPlayer.audioContext.decodeAudioData(res, function (buf) {
        src.buffer = buf;
        src.connect(audioPlayer.audioContext.destination);
        src.start(0);
      });
      src = audioPlayer.audioContext.createBufferSource();
    })
  };

  playBgm(name){//音の再生がループする再生
    let dir = null;
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].name === name){
        dir = this.data[i].dir;
      }
    }
    let src = null;
    const audioPlayer = this;
    fetch(name.dir, {method:"GET",}).then(response => response.arrayBuffer()).then(arrayBuffer => {
      const res = arrayBuffer;
      audioPlayer.audioContext.decodeAudioData(res, function (buf) {
        src.loop = true;
        src.buffer = buf;
        src.connect(audioPlayer.audioContext.destination);
        src.start(0);
      });
      src = audioPlayer.audioContext.createBufferSource();
    })
  };
}

class Audio{
  constructor(name,dir){
    this.name = name;
    this.dir = dir;
  }

  get data(){
    return {name: this.name, dir: this.dir}
  }
}