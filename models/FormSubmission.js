const mongoose = require('mongoose');


const submissionSchema = new mongoose.Schema({
    formId: {type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true},
    submittedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // Reference to User
    responses: [
        {
            fieldId: {type: String, required: true},
            answer: {type: mongoose.Schema.Types.Mixed}, // Text or array for multi-choice
        }
    ],
    submittedAt: {type: Date, default: Date.now},
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;