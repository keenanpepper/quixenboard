(function () {

  var logger = {log: console.log};

  // returns list of scale entries (inc. period but not including 1/1) as freq ratios
  var parseScale = function(scaleStr) {
    var entries = scaleStr.split('-');
    ret = []
    for (i in entries) {
      ret.push(parseScaleEntry(entries[i]));
    }
    return ret;
  };

  // returns the scale entry as a freq ratio
  var parseScaleEntry = function(entry) {
    if (entry.includes('/')) {
      nd = entry.split('/');
      return parseInt(nd[0]) / parseInt(nd[1]);
    } else { // it's cents
      return Math.pow(2, parseFloat(entry)/1200);
    }
  };

  var urlParams = new URLSearchParams(window.location.search);
  var scale = parseScale(urlParams.get('scale'));
  logger.log('scale: ' + scale);

  // returns freq for given note num (can be any integer) where 1/1 is note num 0
  var freqForNoteNum = function(note, baseFreq = 261.625565301) {
    var nPeriods = Math.floor(note/scale.length);
    var equiv = note - nPeriods * scale.length;
    return baseFreq * Math.pow(scale[scale.length-1], nPeriods) * (equiv == 0 ? 1 : scale[equiv-1]);
  }

  var keyMapping = {
    'a': 0,
    's': 1,
    'd': 2,
    'f': 3,
    'g': 4,
    'h': 5,
    'j': 6,
    'k': 7,
    'l': 8,
    ';': 9,
    '\'': 10,
  };

  var freq = function(key) {
    return freqForNoteNum(keyMapping[key]);
  }

  //create a synth and connect it to the master output (your speakers)
  var synth = new Tone.PolySynth().toMaster();

  var keysDown = {};

  window.addEventListener('keydown', function(event) {
    if (!keysDown[event.key]) {
      keysDown[event.key] = true;
      logger.log('added ' + event.key + ' to keysDown, current value is ' + JSON.stringify(keysDown));
      synth.triggerAttack(freq(event.key));
    } else {
      logger.log('ignored keydown for ' + event.key + ' since key was already down');
    }
  });

  window.addEventListener('keyup', function(event) {
    if (keysDown[event.key]) {
      delete keysDown[event.key];
      logger.log('removed ' + event.key + ' from keysDown, current value is ' + JSON.stringify(keysDown));
      synth.triggerRelease(freq(event.key));
    } else {
      logger.log('ignored keyup for ' + event.key + ' since key was already up');
    }
  });

})();
