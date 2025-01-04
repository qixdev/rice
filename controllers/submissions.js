// Submissions
const Submission = require("../models/FormSubmission");
const Form = require("../models/Form");

async function getUserSingleSubmission(userId, formId) {
    return await Submission.findOne({submittedBy: userId, formId: formId});
}

async function getUserSubmissions(userId) {
    return await Submission.find({submittedBy: userId}).select('-__v')
}

async function submitForm(formId, submissionData) {
    console.log(submissionData);
    const submission = await Submission.create(submissionData);
    await Form.findByIdAndUpdate(formId, {$push: {submissions: submission.id}});
    return submission;
}

async function getFormSubmissions(formId) {
    return await Submission.find({formId}).populate('submittedBy', 'email');
}

module.exports = {
    getUserSubmissions,
    submitForm,
    getFormSubmissions,
    getUserSingleSubmission,
}