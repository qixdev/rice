// Submissions
const Submission = require("../models/FormSubmission");
const Form = require("../models/Form");

async function getUserSingleSubmission(userId, formId) {
    return Submission.findOne({submittedBy: userId, formId: formId});
}

async function getUserSubmissions(userId) {
    return Submission.find(
        {submittedBy: userId}).select(
        '-__v -submittedBy').populate(
        'formId', 'title'); // populating to get title to display on frontend.
}

async function submitForm(formId, submissionData) {
    console.log(submissionData);
    const submission = await Submission.create(submissionData);
    await Form.findByIdAndUpdate(formId, {$push: {submissions: submission.id}});
    return submission;
}

async function getFormSubmissions(formId) {
    return Submission.find({formId}).populate('submittedBy', 'email');
}

async function getFormSubmissionsCount(formId) {
    return Submission.countDocuments({formId});
}

module.exports = {
    getUserSubmissions,
    submitForm,
    getFormSubmissions,
    getUserSingleSubmission,
    getFormSubmissionsCount,
}