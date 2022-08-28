const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Content = mongoose.model('Content',
  new mongoose.Schema({
    kind: { type: String, required: true }
  }, { collection: 'content' })
);

const ContentHeading = Content.discriminator('ContentHeading',
  new mongoose.Schema({
    value: { type: String, required: true }
  })
);

const ContentParagraph = Content.discriminator('ContentParagraph',
  new mongoose.Schema({
    value: { type: String, required: true }
  })
);

const ContentVideo = Content.discriminator('ContentVideo',
  new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    video: { type: String, required: true },
    interactivity: { type: [Schema.Types.ObjectId], ref: 'Interactivity' }
  })
);

module.exports = {
  Content,
  ContentHeading: mongoose.model('ContentHeading'),
  ContentParagraph: mongoose.model('ContentParagraph'),
  ContentVideo: mongoose.model('ContentVideo')
};
