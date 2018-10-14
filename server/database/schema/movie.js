const mongoose = require('mogoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
    doubanId: {
        unique: true,
        type: String
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    videoKey: String,
    posterKey: String,
    converKey: String,

    rawTitle: String,
    moiveTypes: [String],
    pubDate: Mixed,
    year: Number,

    tags: [String],

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
            
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

movieSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
})

mongoose.model('Movie', movieSchema)