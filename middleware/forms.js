import {Types} from "mongoose";

const validateFormId = (req, res, next) => {
    const formId = req.params.id;
    console.log(formId);
    if (!Types.ObjectId.isValid(formId)) {
        return res.status(400).json({error: 'invalid form id'});
    }
    req.formId = formId;
    next();
}

const validateFormBody = (req, res, next) => {
    const {
        title,
        description,
        fields,
        is_anonymous: isAnonymous,
        submissions_limit: submissionsLimit,
        // submission_reward: submissionReward
    } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({error: 'title is required and must be a string'});
    }

    if (description && typeof description !== 'string') {
        return res.status(400).json({error: 'description must be a string'});
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
        return res.status(400).json({error: 'fields is required and must be an array with at least one element'});
    }

    for (const field of fields) {
        if (typeof field.label !== 'string' || !field.label.trim()) {
            return res.status(400).json({error: 'each field must have a non-empty string label'});
        }
        if (!['text', 'checkbox', 'radio'].includes(field.type)) {
            return res.status(400).json({error: 'field type must be one of "text", "checkbox", or "radio"'});
        }
        if (field.type !== 'text' && (!Array.isArray(field.options) || field.options.length === 0)) {
            return res.status(400).json({error: 'fields of type "checkbox", or "radio" must have a non-empty options array'});
        }
        if (field.required !== undefined && typeof field.required !== 'boolean') {
            return res.status(400).json({error: 'field "required" must be a boolean value'});
        }
        // 10 is the maximum amount of options allowed in the question.
        if (field.type !== 'text' && field.options.length > 10) {
            return res.status(400).json({error: 'maximum amount of options is 10'});
        }
    }

    if (isAnonymous !== undefined && typeof isAnonymous !== 'boolean') {
        return res.status(400).json({error: 'field `is_anonymous` must be a boolean value'});
    }
    // todo can make a helper functions `validateNumber` and provide fields there
    if (submissionsLimit === undefined || typeof submissionsLimit !== 'number' || submissionsLimit <= 0) {
        return res.status(400).json(
            {error: 'field `submissions_limit` is required and must be a valid number greater than 0'});
    }


    // if (submissionReward === undefined || typeof submissionReward !== 'number' || submissionsLimit <= 0) {
    //     return res.status(400).json(
    //         {error: 'field `submissions_limit` is required and must be a valid number greater than 0'});
    // }

    req.form = {
        title,
        description: description || null,
        fields,
        isAnonymous: isAnonymous || false,
        submissionsLimit: submissionsLimit,
        // submissionReward: submissionReward,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.user._id,
    };

    next();
};

export {validateFormId, validateFormBody};
// Using `module.exports` in this case could cause an error because the file uses ES6 `import` and `export` syntax.
// Mixing CommonJS (`module.exports`) and ES6 modules can lead to compatibility issues, as they are different module systems.
// Specifically, when using ES6 destructured `import` statements (`import { ... }`), the exported values must align with
// the ES6 `export` syntax. Using `module.exports` would result in the exported values being treated as a default export,
// which breaks destructured imports.

