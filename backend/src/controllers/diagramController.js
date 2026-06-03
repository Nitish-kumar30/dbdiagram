import crypto from 'crypto';
import Diagram from '../models/Diagram.js';

export const getLatestDiagram = async(req, res) => {
  try{

    const diagram = await Diagram.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });

    if(!diagram){

      return res.status(404).json({message:"No diagram found" });
    }

    res.json(diagram);

  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
};

export const saveDiagram = async(req, res) => {
  try {
    const { title, schema } = req.body;
    const newDiagram = new Diagram({
      title,
      schema,
      userId: req.user._id,
    });
    await newDiagram.save();
    res.status(201).json(newDiagram);

  }catch (error){

    res.status(500).json({ message: "Server error" });
  }
};

export const updateDiagram = async (req, res) => {
  try{

    const { title, schema } = req.body;

    const diagram = await Diagram.findOneAndUpdate(

      { _id: req.params.id, userId: req.user._id },
      { title, schema },
      { new: true }

    );
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }
    res.json(diagram);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const shareDiagram = async (req, res) => {
  try {
    let diagram = await Diagram.findOne({ _id: req.params.id, userId: req.user._id });

    if (!diagram){

      return res.status(404).json({ message: "Diagram not found" });
    }

    if(!diagram.shareToken){

      diagram.shareToken = crypto.randomBytes(16).toString('hex');
      diagram.isPublic = true;
      await diagram.save();
    }
    
    res.json({ shareToken: diagram.shareToken });
  }catch (error){

    res.status(500).json({ message: "Server error" });
  }
};

export const getSharedDiagram = async (req, res) => {
  try{
    const diagram = await Diagram.findOne({ shareToken: req.params.token, isPublic: true });
    if (!diagram) {
      return res.status(404).json({ message: "Shared diagram not found" });
    }
    res.json(diagram);
  } catch(error) {
    res.status(500).json({ message: "Server error" });
  }
};
