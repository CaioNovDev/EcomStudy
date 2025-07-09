const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');

router.get('/', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: '#ccf2ff'
  });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
});

module.exports = router;
