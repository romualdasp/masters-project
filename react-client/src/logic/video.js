class VideoEvent {

  constructor(startTime = 0) {
    this._current = startTime;
  }

  update(time) {
    let next = Math.floor(time);
    
    if (next === this._current) {
      return false;
    }

    this._current = next;
    return true;
  }

  get current() {
    return this._current;
  }

}

export default VideoEvent;

/*
  let closest = (time, interactivity) => {
    if (interactivity.length === 0) {
      return null;
    }
    
    interactivity.forEach((element, index) => {
      
      
    })

    let watched = interactivity.filter(element => element.timestamp < time);
    if (watched.length > 0) {
      let display = watched.reduce((max, element) => max.timestamp > element.timestamp ? max : element);
      
      if (this.activated === false) {
        console.log(display);
        this.activated = true;
        this.activatedTime = time;
        this.video.pause();
      }
    }
    // function closestNumberOver(x, arr) {
    //   return arr.find(d => d >= x) || arr[arr.length - 1]
    // }
  };

  closest(time, this.state.interactivity);
*/
