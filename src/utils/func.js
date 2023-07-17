const { createTransport } = require('nodemailer');
const htmlpdf = require('html-pdf');
const Mustache = require('mustache');
const fs = require('fs');

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'eddie.balistreri27@ethereal.email',
    pass: 'jwvHv6UQezng1W1pAt'
  }
});

const generatePdf = (data, options) => {
  try {
    const html = Mustache.render(fs.readFileSync(options.templateDir).toString(), data);
    return new Promise((resolve, reject) => htmlpdf.create(html, {
      ...options,
      format: 'a4',
      orientation: 'portrait',
      border: {
        top: '3mm',
        right: '3mm',
        bottom: '3mm',
        left: '3mm',
      },
      footer: {
        height: '18mm',
        contents: {
          default: '<span style="color: #444;">Page {{page}}</span> of <span>{{pages}}</span>',
        },
      },
    })
      .toBuffer((err, buffer) => {
        if (err || !buffer) {
          console.log('PDF ERR: ', err);
          return reject(new Error('Something went wrong generating the PDF'));
        }

        return resolve(buffer);
      }));
  } catch (error) {
    console.log('PDF ERROR: ', error);
    return new Error('Something went wrong generating the PDF');
  }
};



module.exports = {
  emailTransporter: transporter,
  generatePdf,
}