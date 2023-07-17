const Bull = require('bull');
const { generatePdf, emailTransporter } = require('./utils/func');

const emailQueue = new Bull('email-queue', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
    password: null,
  },
});

emailQueue.process(async (job, done) => {
  const { data } = job;
  
  try {
    const emailHtmlTemplate = await generatePdf({ username: data.username }, { templateDir: 'src/templates/packingTemplate.html' });
  
    const emailConfig = {
      from: 'eddie.balistreri27@ethereal.email',
      to: 'jany.fadel20@ethereal.email',
      subject: 'Welcome email',
      text: `Welcome user ${data.username}`,
      html: emailHtmlTemplate,
    };
  
    const email = await emailTransporter.sendMail(emailConfig);
    console.log('RESULTADO DE ENVIAR EL EMAIL: ', email);
    done();
    
  } catch (error) {
    console.log('ERROR AL ENVIAR EL EMAIL: ', error);
    done();
  }
});

emailQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});

emailQueue.on('error', (job, result) => {
  console.log(`Error on job ${result}`);
});

emailQueue.on('failed', (job, result) => {
  console.log(`Job failed with result ${result}`);
});

module.exports = {
  emailQueue,
};