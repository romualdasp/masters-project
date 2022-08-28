const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    _owner: Schema.Types.ObjectId,
    students: { type: [Schema.Types.ObjectId], ref: 'Student' },
    title: {
        type: String,
        required: true,
        min: 6
    },
    description: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    code: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    image: {
        type: String,
        default: ''
    },
    content: { type: [Schema.Types.ObjectId], ref: 'Content' }
});

module.exports = mongoose.model('Course', courseSchema);
