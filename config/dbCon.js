const { mongoose } = require('mongoose');

const connectDB = async (params) => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.error(err);
  }
};

module.exports = connectDB;
