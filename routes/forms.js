const {Router} = require('express');
const protected = require('../middleware/auth');
const {validateFormId, validateFormBody} = require('../middleware/forms');
const {
    createForm,
    getForm,
    updateForm,
    deleteForm,
    getUserForms, calculateFormCost,
} = require('../controllers/forms');
const {
    getFormSubmissions,
    submitForm,
    getUserSubmissions,
    getUserSingleSubmission
} = require('../controllers/submissions');
const {changeUserBalance} = require("../controllers/users");

const router = Router();

/* TODO things
- using balances when creating forms.
- build the economic incentive around this:
    - giving users X credits by default
    - let burn credits with every form creation(anti-inflation)
    - let users buy and sell the tokens
 */

// check where user have submitted the forms, but it should output the titles though?
// Anyway, seems like unimportant route for now.
// TODO: should get titles of the forms(at least)
router.get('/my-submissions', protected, async (req, res) => {
    const user = req.user;
    const submissions = await getUserSubmissions(user._id);
    res.status(200).json(submissions);
});


// Get created forms of the user.
// I think I can amend the fields of a forms in the responses to make payload smaller? todo
router.get('', protected, async (req, res) => {
    const user = req.user;
    try {
        const forms = await getUserForms(user._id);
        res.status(200).json(forms);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'failed to fetch user forms'});
    }
});


// get the form to change it
// maybe this route is redundant cuz the output of the form to submit and to edit is the same
// todo this should be resolved after creating the ui.
router.get('/:id', protected, validateFormId, async (req, res) => {
    const formId = req.params.id;

    try {
        const form = await getForm(formId);
        if (!form) {
            return res.status(404).json({error: 'Form not found'});
        }
        if (form.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({error: 'You do not have access to this form'});
        }
        res.status(200).json(form);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'An error occurred while fetching the form'});
    }
});


// TODO: make transactions
router.post('', protected, validateFormBody, async (req, res) => {
    const formCost = calculateFormCost(req.form);
    if (formCost > req.user.balance) {
        return res.status(400).json(
            {
                error: 'your balance is not enough to create this form. ' +
                    'Try to reduce the number of questions or number of submissions'
            });
    }
    try {
        // TODO: I think I need transactions for this stuff, cuz what if form gets uncreated but balance is taken?
        // for that you need to change the function to inject the session from the route.
        await changeUserBalance(req.user._id, -formCost);
        const newForm = await createForm(req.form);
        res.status(201).json(newForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'failed to create form'});
    }
});


// TODO: balance stuff
// TODO: transactions stuff.
router.put('/:id', protected, validateFormId, validateFormBody, async (req, res) => {
    const formId = req.params.id;
    const newFormData = req.form;

    // TODO: check if user has enough balance to change the details.
    const newFormCost = calculateFormCost(newFormData);

    try {
        const form = await getForm(formId);
        // TODO: form schema also has to have cost field to not calculate everything again.

        if (!form) {
            return res.status(404).json({error: 'form not found'});
        }
        if (form.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({error: 'you do not have permission to update this form'});
        }

        const oldFormCost = calculateFormCost(form);
        if (newFormCost - oldFormCost > req.user.balance) {
            return res.status(402).json({error: 'your balance is not enough to update this form.'})
        }
        // TODO: transaction here:
        const updatedForm = await updateForm(formId, newFormData);
        // if user deleted some of the questions, he won't get the tokens back?
        // I think he should get (max_submissions - total_submissions) * question_cost credits back.
        // But for now this requires ditching everything here, but the codebase is still unstable, so later.
        /* Outlining how it's made
        * - Get the difference in questions
        *   + if question is absent in new form, it is deleted
        *   + if question is absent in the old form, it is added
        * - calculate the cost for new questions, taking into account the (submissions_limit - total_submissions)
        *   + because we don't want to charge more than user can spend.
        * - calculate the returning tokens based on (submissions_limit - total_submissions)
        * - change the balance
        * and everything should be in a transaction.
         */
        const _newBalance = await changeUserBalance(req.user._id, oldFormCost - newFormCost);
        res.status(200).json(updatedForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to update form'});
    }
});


// TODO: refunding tokens.
router.delete('/:id', protected, validateFormId, async (req, res) => {
    const formId = req.params.id;
    const form = await getForm(formId);
    if (!form) {
        return res.status(404).json({error: 'form not found'});
    }
    if (form.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({error: 'You do not have permission to delete this form'});
    }
    await deleteForm(formId);
    // TODO: return some tokens to user from the amount of users.
    // get the cost of the questions.
    // refund back (submission_limit - total_submissions) * questions_single_cost
    res.status(200).json({message: 'form deleted successfully'});
})


// TODO: giving tokens
// TODO: transactions stuff.
router.post('/:id/submit', protected, validateFormId, async (req, res) => {
    const formId = req.formId;
    const user = req.user;
    const submissionData = req.body;


    // TODO: check if form has not surpassed it's capacity in tokens.
    const form = await getForm(formId);
    if (!form) {
        return res.status(404).json({error: 'form not found'});
    }

    if (form.createdBy.toString() === user._id.toString()) {
        return res.status(400).json({error: 'you cannot submit your own form'});
    }

    const {fields} = form;

    // Check if user has already submitted
    const isAlreadySubmitted = await getFormSubmissions(formId, user._id);
    if (isAlreadySubmitted.length > 0) {
        return res.status(403).json({error: 'you have already submitted this form'});
    }
    // Validate responses TODO: check everything again, maybe separate on functions, cuz it is becoming bloated.
    for (const field of fields) {
        const response = submissionData.responses.find(r => r.fieldId.toString() === field._id.toString());
        if (field.required && !response) {
            return res.status(400).json({error: `field "${field.label}" is required`});
        }
        if (response) {
            if (field.type === 'radio') {
                if (!Number.isInteger(response.answer) || response.answer < 0 || response.answer >= field.options.length) {
                    return res.status(400).json({error: `field "${field.label}" has an invalid answer`});
                }
            }
            if (field.type === 'checkbox') {
                if (!Array.isArray(response.answer) || response.answer.some(index => !Number.isInteger(index) || index < 0 || index >= field.options.length)) {
                    return res.status(400).json({error: `field "${field.label}" has invalid answers`});
                }
            }
            if (field.type === 'text') {
                if (typeof response.answer !== 'string') {
                    return res.status(400).json({error: `field "${field.label}" has an invalid answer`});
                }
            }
        }
    }

    submissionData.formId = formId;
    submissionData.submittedBy = user._id;
    // todo give user the tokens that he should receive for submission.
    const submission = await submitForm(formId, submissionData);
    res.status(201).json(submission);
});


// managing form submissions
router.get('/:id/submit', protected, validateFormId, async (req, res) => {
    // get form to submit it.
    // btw, can split it on types if it's anonymous or not etc. TODO
    // maybe allow users to submit forms when it's not anonymous whether they are registered or not?
    const formId = req.formId;
    const user = req.user;
    const form = await getForm(formId);
    if (!form) {
        return res.status(404).json({error: 'form not found'});
    }

    // We must do something about the protected.
    // We should allow any users to submit the form without registering if it's anonymous.
    // Seems that there should be less strict middleware, something like "soft_authenticate"
    // So in this route we will just see who is the user and based on the form(anon or not) give the responses
    // Anyway, later features.

    const submission = await getUserSingleSubmission(user._id, formId);
    if (submission) {
        // maybe add a functionality to view the responses that were submitted?
        // todo: yeah, maybe return the responses and display them in frontend.
        // return res.json(submission);
        return res.status(409).json({error: 'you have already submitted this form'});
    }
    return res.status(200).json(form);
})


// get submissions of the form(as a form creator)
// this route is too complicated and I make it with AI it will be a technical debt.
// TODO: make aggregation YOURSELF.
router.get('/:id/submissions', protected, validateFormId, async (req, res) => {
    const formId = req.formId;
    // TODO: can make a middleware to validate if form exists and if user that asks for this route is the real owner.
    const form = await getForm(formId);
    if (!form) {
        return res.status(404).json({error: 'form not found'});
    }
    if (form.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({error: 'you do not have permission to view this form\'s submissions'});
    }
    const formSubmissions = await getFormSubmissions(formId);

    // Aggregate Metadata
    const totalSubmissions = formSubmissions.length;
    const tokensSpent = form.submissionLimit * form.fields.length; // Assuming tokens calculation based on submissionLimit and questions
    const metaData = {
        title: form.title,
        description: form.description,
        submissionLimit: form.submissionLimit,
        totalSubmissions,
        tokensSpent
    };

    const questionsData = form.fields.map(field => {
        const answers = formSubmissions.flatMap(submission => {
            const response = submission.responses.find(r => r.fieldId.toString() === field._id.toString());
            return response ? response.answer : [];
        }).reduce((acc, answer) => {
            acc[answer] = (acc[answer] || 0) + 1;
            return acc;
        }, {});

        const answersArray = Object.keys(answers).map(answer => ({
            answer,
            count: answers[answer]
        }));

        const submitters = formSubmissions.map(submission => {
            const response = submission.responses.find(r => r.fieldId.toString() === field._id.toString());
            return {
                email: submission.submittedBy.email,
                answer: response ? response.answer : null,
                allResponses: submission.responses.map(r => ({
                    fieldId: r.fieldId,
                    answer: r.answer
                }))
            };
        });

        return {
            fieldId: field._id,
            label: field.label,
            type: field.type,
            answers: answersArray,
            submitters
        };
    });

    if (!form.isAnonymous) {
        questionsData.forEach(question => {
            question.submitters = formSubmissions.map(submission => ({
                email: submission.submittedBy.email,
                allResponses: submission.responses.map(r => ({
                    fieldId: r.fieldId,
                    answer: r.answer
                }))
            }));
        });
    }

    res.status(200).json({
        metaData,
        questionsData
    });
});


module.exports = router;