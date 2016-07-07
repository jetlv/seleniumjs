var tesseract = require('node-tesseract');
var options = {
    l: 'eng',
    psm: 10
};
tesseract.process(__dirname + '/detects.png',options,function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});