const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Interactivity = mongoose.model('Interactivity',
  new mongoose.Schema({
    kind: { type: String, required: true },
    question: { type: String, required: true },
    timestamp: { type: Number, required: true },
  }, { collection: 'interactivity' })
);

const SingleChoice = Interactivity.discriminator('SingleChoice',
  new mongoose.Schema({
    answers: { type: [String] },
    correct: { type: Number }
  })
);

const MultipleChoice = Interactivity.discriminator('MultipleChoice',
  new mongoose.Schema({
    answers: { type: [String] },
    correct: { type: [Boolean] }
  })
);

const MatchPairs = Interactivity.discriminator('MatchPairs',
  new mongoose.Schema({
    primary: { type: [String] },
    secondary: { type: [String] }
  })
);

const TextEntry = Interactivity.discriminator('TextEntry',
  new mongoose.Schema({
    correct: { type: String }
  })
);

module.exports = {
  Interactivity,
  SingleChoice: mongoose.model('SingleChoice'),
  MultipleChoice: mongoose.model('MultipleChoice'),
  MatchPairs: mongoose.model('MatchPairs'),
  TextEntry: mongoose.model('TextEntry'),
};
