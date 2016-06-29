var fs = require('fs');

module.exports = function (driver, filePath) {
    driver.takeScreenshot().then(function (data) {
        fs.writeFile(filePath, data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
            if (err) throw err;
        });
    });
}