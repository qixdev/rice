const Form = require('../models/Form');


const BURNT_FEE = 10;

// TODO: centralize this constant in one class though.

async function createForm(formData) {
    return await Form.create(formData);
}

async function getForm(formId) {
    return await Form.findById(formId).select('-__v');
}

async function calculateFormCost(form) {
    let cost = 0;
    cost += BURNT_FEE;

    const questions = form.fields;
    for (const question of questions) {
        // TODO: calculate tokens only of questions that are required?
        // TODO: maybe calculate tokens based on number of options on the question?
        // So when user submits that he won't receive any tokens?
        if (!question.required) {
            continue;
        }
        const question_type = question.type.toString();
        if (question_type === 'radio') {
            cost += 1; // 1 token for each one answer question.
        } else if (question_type === 'checkbox') {
            cost += 3; // 3 tokens for each multi-choice questions. But people probably going to try to by pass it
            // by creating 2 questions with 'radio' type. Oks
        } else if (question_type === 'text') {
            cost += 5; // open-ended question should be different.
        }
    }
    return cost;
}

async function updateForm(formId, formData) {
    return Form.findByIdAndUpdate(formId, formData, {new: true}).select('-__v');
}

async function deleteForm(formId) {
    return Form.findByIdAndDelete(formId);
}

async function getUserForms(userId) {
    return Form.find({createdBy: userId});
}


module.exports = {
    createForm,
    getForm,
    updateForm,
    deleteForm,
    getUserForms,
    calculateFormCost,
}