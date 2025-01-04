const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    fields: [
        {
            // _id - here is the field that we will be relating to.
            label: {type: String, required: true},
            type: {type: String, required: true, enum: ['text', 'checkbox', 'radio']},
            /* note about the type:
            * text - just input text, it means some open-ended question
            * checkbox - means multiple possible answers
            * radio - means user can submit only 1 answer from all options */
            options: [String], // For checkbox and radio
            required: {type: Boolean, default: false},
        }
    ],
    isAnonymous: {type: Boolean, default: false},
    submissionsLimit: {type: Number, required: true}, // Must be at least 1
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // Reference to User
    createdAt: {type: Date, default: Date.now},
});

/* Here is a decision point that I have
* For anonymous forms, what should I do?
* - still apply a submission_limit
*   in this case I will have to collect tokens from users whether the form is anonymous or not.
*   so in this case I will be able to give that tokens to users that have registered.
* - remove a submission_limit
*   in this case there is no incentive of making form anonymous(cuz you just won't get any responses)
*   because there is no tokens given from a submission
*
* I guess I will go with the first option. Let's keep the economic incentive strict.
* */

const Form = mongoose.model('Form', formSchema);


module.exports = Form;
