const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Submission = mongoose.model('Submission',
  new mongoose.Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    video: { type: Schema.Types.ObjectId, ref: 'Content' },
    interactivity: { type: Schema.Types.ObjectId, ref: 'Interactivity' },
    score: { type: Number, required: true },
  }, { collection: 'submissions' })
);

const SingleChoiceSubmission = Submission.discriminator('SingleChoiceSubmission',
  new mongoose.Schema({
    submitted: { type: Number }
  })
);

const MultipleChoiceSubmission = Submission.discriminator('MultipleChoiceSubmission',
  new mongoose.Schema({
    submitted: { type: [Boolean] }
  })
);

const MatchPairsSubmission = Submission.discriminator('MatchPairsSubmission',
  new mongoose.Schema({
    submitted: { type: [String] }
  })
);

const TextEntrySubmission = Submission.discriminator('TextEntrySubmission',
  new mongoose.Schema({
    submitted: { type: String }
  })
);

module.exports = {
  Submission,
  SingleChoiceSubmission: mongoose.model('SingleChoiceSubmission'),
  MultipleChoiceSubmission: mongoose.model('MultipleChoiceSubmission'),
  MatchPairsSubmission: mongoose.model('MatchPairsSubmission'),
  TextEntrySubmission: mongoose.model('TextEntrySubmission'),
};
