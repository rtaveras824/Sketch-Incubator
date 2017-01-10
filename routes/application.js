const express = require('express');
const router = new express.Router;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('User');
const Drawing = mongoose.model('Drawing');
const Category = mongoose.model('Category');
const UserDrawing = mongoose.model('UserDrawing');
const UserFollow = mongoose.model('UserFollow');



module.exports = router;