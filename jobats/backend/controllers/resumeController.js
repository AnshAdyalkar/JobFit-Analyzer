const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');
const { extractTextFromPDF } = require('../utils/pdfParser');

exports.uploadResume = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a valid file (PDF, JPG, PNG, DOCX)',
      });
    }

    let extractedText = '';
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt === '.pdf') {
      extractedText = await extractTextFromPDF(req.file.path);
    } else {
      // Placeholder for other formats (JPG, PNG, DOCX)
      // In a real app, use mammoth for DOCX and tesseract for images
      extractedText = `Text content for ${req.file.originalname} (Preview enabled for all formats)`;
    }

    const resume = await Resume.create({
      email,
      fileName: req.file.originalname,
      filePath: req.file.filename, // Store just the filename
      extractedText,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResumeHistory = async (req, res, next) => {
  try {
    const { email } = req.params;
    const history = await Resume.find({ email }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    // Delete file from disk
    const fullPath = path.join(__dirname, '..', 'uploads', resume.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await Resume.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const fullPath = path.join(__dirname, '..', 'uploads', resume.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    res.download(fullPath, resume.fileName);
  } catch (error) {
    next(error);
  }
};

exports.previewResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const fullPath = path.join(__dirname, '..', 'uploads', resume.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    res.sendFile(fullPath);
  } catch (error) {
    next(error);
  }
};
