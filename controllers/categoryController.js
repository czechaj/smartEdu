const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    req.flash('success', ` ${category.name} category created succesfully`)
    res.status(201).redirect('/users/dashboard');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      err,
    });
  }
};

exports.deleteCategory = async(req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    
    req.flash('error', ` ${category.name} category has been deleted successfully`);
    res.status(200).redirect('/users/dashboard');
    
    

  } catch (err) {
    
  }
};