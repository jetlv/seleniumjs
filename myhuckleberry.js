/// <reference path="include.d.ts" />

var webdriver = require('selenium-node-webdriver');
var fs = require('fs');
var screen = require('./toolkits/screenshoter');


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
webdriver().
    then(function (driver) {
        driver.get('http://myhuckleberry.com/register.aspx').
            then(function () {
                driver.wait(function () {
                    console.log('waiting form...');
                    return driver.findElement(driver.webdriver.By.name("ctl00$ctl00$cphOtherMaster$cph_content$txtFirstName")).isDisplayed();
                }, 20000);
            }).
            then(function () {
                screen(driver, 'screenshots\\firstScreen.png');
                return driver.
                    findElement(driver.webdriver.By.name("ctl00$ctl00$cphOtherMaster$cph_content$txtFirstName")).
                    sendKeys(_randomString*(4));
            }).then(function () {
                console.log('accessed');
            }).
            then(function () {
                return driver.
                    findElement(driver.webdriver.By.name('ctl00$ctl00$cphOtherMaster$cph_content$txtLastName')).
                    sendKeys(_randomString*(4));
            }).
            then(function () {
                return driver.
                    findElement(driver.webdriver.By.name('ctl00$ctl00$cphOtherMaster$cph_content$txtDisplayName')).
                    sendKeys(_randomString*(4));
            }).then(function () {
                var email = _randomString*(8) + '@gmail.com';
                driver.
                    findElement(driver.webdriver.By.name('ctl00$ctl00$cphOtherMaster$cph_content$txtEmail')).
                    sendKeys(email);
                return email;
            }).then(function (email) {
                return driver.
                    findElement(driver.webdriver.By.name('ctl00$ctl00$cphOtherMaster$cph_content$txtVerifyEmail')).
                    sendKeys(email);
            }).then(function () {
                screen(driver, 'screenshots\\afterEmail.png');
            }).then(function () {
                  return driver.
                    findElement(driver.webdriver.By.name('ctl00$ctl00$cphOtherMaster$cph_content$txtPassword1')).
                    sendKeys(123456);
            }).then(function () {
                 return driver.
                    findElement(driver.webdriver.By.name('ctl00$ctl00$cphOtherMaster$cph_content$txtPassword2')).
                    sendKeys(123456);
            }).then(function () {
                return driver.
                    findElement(driver.webdriver.By.name("ctl00$ctl00$cphOtherMaster$cph_content$btnSubmit")).click();
            }).then(function() {
                driver.wait(function () {
                    console.log('waiting registered...');
                    driver.takeScreenshot().then(function (data) {
                    fs.writeFile('D:\\screenshots\\screen_waitingRegister.png', data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
                        if (err) throw err;
                    });
                })
                    return driver.isElementPresent(driver.webdriver.By.xpath("//h3[text()='Finish the process:']"));
                }, 10000);               
            }).then(function () {
                driver.takeScreenshot().then(function (data) {
                    fs.writeFile('D:\\screenshots\\screen_final.png', data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
                        if (err) throw err;
                    });
                })
            }).
            then(function () {
                driver.quit();
            });
    });

