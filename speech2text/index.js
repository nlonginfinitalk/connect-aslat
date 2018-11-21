require('dotenv').load('.env');

const getTimer = function (words) {
  return {
    startTime: words[0].startTime.seconds,
    endTime: words[words.length - 1].endTime.seconds,
  }
};

const formatResult = function (results) {
  results.forEach(result => {
    let words = result.alternatives[0].words;
    console.log(getTimer(words));
    console.log(result.alternatives[0].transcript);
  });
};

function main() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const uri = 'gs://test_180627/stereo_mon/A/default/201806/1530167243.94054-03:27:23-in.wav';

  // Reads a local audio file and converts it to base64
  // const file = fs.readFileSync(fileName);
  // const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: uri,
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 8000,
    languageCode: 'ja-JP',
    enableWordTimeOffsets: true,
  };
  const request = {
    audio: audio,
    config: config,
  };

  client
    .longRunningRecognize(request)
    .then(data => {
      const operation = data[0];
      // Get a Promise representation of the final result of the job
      return operation.promise();
    })
    .then(data => {
      const response = data[0];
      formatResult(response.results);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

main();
