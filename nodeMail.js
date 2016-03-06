var nodemailer = require('nodemailer');

function sendmail(opt) {

    sendOpt = {
        service: opt.service, //163
        secureConnection: true,
        auth: {
            user: opt.user,
            pass: opt.pass
        }
    }

    mailOpt =  {
        from:opt.user,
        to:opt.to,
        subject:opt.subject,
        html:opt.html

    }
    var transporter = nodemailer.createTransport(sendOpt);
    transporter.sendMail(mailOpt, function(error, info) {
        if (!error) {
            console.log(info)

        } else {
            console.log(error);
        }
        transporter.close()
    });

};

sendmail({
    service: '***', //example:163
    user: '***@**.**',//example:***@163.com
    pass: '****',
    to: '***@**.**', // list of receivers
    subject: '***', // title
    html: "<h2>test</h2>"
});
