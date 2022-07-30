const Dude = require('../model/Dude');

const getAllDudes = async (req, res) => {
  const dudes = await Dude.find({});
  res.json(dudes);
};

const addDude = async (req, res) => {
  const { firstname, lastname, copy } = req.body;

  if (!firstname || !lastname)
    return res
      .status(400)
      .json({ message: "Man, I don't even know your name!" });

  const newDude = await Dude.create({
    firstname,
    lastname,
    copy,
  });

  res.status(201).json(newDude);
};

const updateDude = async (req, res) => {
  const { id, firstname, lastname, copy } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "You've gotta give me his numbers man" });
  }

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
};

const deleteDude = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "You've gotta give me his numbers man" });
  }

  await Dude.findByIdAndDelete(id, {}, (err, data) =>
    err ? console.log(err) : console.log('Updated User : ', data)
  );

  res.status(201).json(data.dudes);
};

const getDude = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res
      .status(400)
      .json({ message: "You've gotta give me his numbers man" });
  }

  const myDude = await Dude.findById(parseInt(req.params.id));

  if (!myDude) {
    return res.status(400).json({ message: "I don't even know the dude!" });
  }

  return res.json(myDude);
};

module.exports = {
  getAllDudes,
  addDude,
  updateDude,
  deleteDude,
  getDude,
};
