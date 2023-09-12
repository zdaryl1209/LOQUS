const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
       title: {
        type: String,
        required: true
       },
       description: String,
       due_date: {
        type: Date,
        required: true
       },
       completed: {
        type: Boolean,
        required: true,
        default: false
       }
    }
);

taskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', taskSchema);