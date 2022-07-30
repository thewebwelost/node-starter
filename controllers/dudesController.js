const Dude = require('../model/Dude');

const getAllDudes = async (req, res) => {
  const dudes = await Dude.find();
  if (!dudes) return res.status(204).json({ message: 'No dudes!' });
  res.json(dudes);
};

const addDude = async (req, res) => {
  const { firstname, lastname, copy } = req.body;
  if (!firstname || !lastname)
    return res
      .status(400)
      .json({ message: "Man, I don't even know your name!" });

  try {
    const newDude = await Dude.create({
      firstname,
      lastname,
      copy,
    });
    res.status(201).json(newDude);
  } catch (err) {
    console.err(err);
  }
};

const updateDude = async (req, res) => {
  const { id, firstname, lastname, copy } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "You've gotta give me his numbers man" });
  }

  try {
    const myDude = await Dude.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        copy,
      },
      {},
      (err, data) =>
        err ? console.log(err) : console.log('Updated User : ', data)
    );
    res.status(201).json(myDude);
  } catch (err) {
    console.error(err);
  }
};

const deleteDude = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "You've gotta give me his numbers man" });
  }

  try {
    await Dude.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};

const getDude = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: "You've gotta give me his numbers man" });
  }

  try {
    const myDude = await Dude.findById(req.params.id);
    if (!myDude) {
      return res.status(400).json({ message: "I don't even know the dude!" });
    }
    return res.status(200).json(myDude);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAllDudes,
  addDude,
  updateDude,
  deleteDude,
  getDude,
};
