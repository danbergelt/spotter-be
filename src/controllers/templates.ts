import Template from '../models/Template';
import asyncHandler from '../utils/asyncHandler';
import HttpError from '../utils/HttpError';
const hex = require('is-hexcolor'); // eslint-disable-line
import { Template as TemplateInterface, Tag } from 'src/types/models';

// @desc --> get all templates by user id
// @route --> GET /api/auth/templates
// @access --> Private

export const getTemplatesByUserId = asyncHandler(async (req, res) => {
  const templates: Array<TemplateInterface> = await Template.find({
    user: req.user._id
  });

  return res
    .status(200)
    .json({ success: true, count: templates.length, templates });
});

// @desc --> add template
// @route --> POST /api/auth/template
// @access --> Private

export const addTemplate = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;

  const templates: Array<TemplateInterface> = await Template.find({
    name: req.body.name,
    user: req.body.user
  });

  if (templates.length) {
    return next(new HttpError('Template already exists', 400));
  }

  let colorValidate: Array<Tag | false> = [];

  // map over the tags in the template and error out if invalid color detected
  if (req.body.tags && req.body.tags.length) {
    colorValidate = req.body.tags.map((el: Tag) => hex(el.color));
  }

  if (colorValidate.includes(false)) {
    return next(new HttpError('Invalid color detected', 400));
  }

  const template: TemplateInterface = await Template.create(req.body);

  res.status(201).json({
    success: true,
    template
  });
});

// @desc --> edit template
// @route --> PUT /api/auth/templates/:id
// @access --> Private

export const editTemplate = asyncHandler(async (req, res) => {
  const template: TemplateInterface | null = await Template.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );

  res.status(200).json({
    success: true,
    data: template
  });
});

// @desc --> delete template
// @route --> DELETE /api/auth/template/:id
// @access --> Private

export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    template
  });
});
