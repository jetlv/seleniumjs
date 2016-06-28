var webdriver = require('selenium-node-webdriver');
var fs = require('fs');

function _randomString(len) {
    　　len = len || 32;
    　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (i = 0; i < len; i++) {
        　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
}

console.log('Misson started');
// webdriver().
//     then(function (driver) {
//         driver.get('http://www.tuugo.us/AddYourBusiness').
//             then(function () {
//                 driver.manage().timeouts().implicitlyWait(10000);
//                 driver.takeScreenshot().then(function (data) {
//                     fs.writeFile('D:\\screen.png', data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
//                         if (err) throw err;
//                     });
//                 }); 
//                     return driver.
//                         findElement(driver.webdriver.By.xpath('//input[@name="Email_address"]')).
//                         sendKeys('abcdefg' + '@gmail.com');
//                 }).then(function() {
//                     console.log('accessed');
//                 }).
//                     then(function () {
//                         return driver.
//                             findElement(driver.webdriver.By.name('Password')).
//                             sendKeys('123456');
//                     }).
//                     then(function () {
//                         return driver.
//                             findElement(driver.webdriver.By.name('Confirm_password')).
//                             sendKeys('123456');
//                     }).then(function () {
//                         return driver.
//                             findElement(driver.webdriver.By.xpath("//div[@role='presentation']")).click();
//                     }).then(function () {
//                         return driver.
//                             findElement(driver.webdriver.By.id('acceptSubscribe')).
//                             click();
//                     }).then(function () {
//                         return driver.
//                             findElement(driver.webdriver.By.xpath("//button[@class='checkBeforeSubmit']")).click();
//                     }).then(function (results) {
//                         results.forEach(function (result) {
//                             console.log(result);
//                         });
//                         driver.quit();
//                     });
//             });

webdriver().
    then(function (driver) {
        driver.get('http://www.tuugo.us/AddYourBusiness').
            then(function () {
                return driver.
                    findElement(driver.webdriver.By.xpath("//form[@id='registration_form']//input[@name='Email_address']")).
                    sendKeys('webdriver');
            }).then(function() {
                  driver.takeScreenshot().then(function (data) {
                    fs.writeFile('D:\\screen.png', data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
                        if (err) throw err;
                    });
                }); 
            });
            then(function (results) {
                results.forEach(function (result) {
                    console.log(result);
                });
                driver.quit();
            });
    });