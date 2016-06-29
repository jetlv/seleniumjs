/// <reference path="include.d.ts" />

var webdriver = require('selenium-node-webdriver');
var fs = require('fs');
var screen = require('./toolkits/screenshoter');

// var tw = require('selenium-webdriver');

// tw.WebDriver.Window.

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
        driver.get('http://www.mysheriff.net/').
            then(function () {
                driver.wait(function () {
                    console.log('waiting form...');
                    return driver.findElement(driver.webdriver.By.name("username")).isDisplayed();
                }, 20000);
            }).
            then(function () {
                screen(driver, 'screenshots\\m_firstScreen.png');
                return driver.
                    findElement(driver.webdriver.By.name("username")).
                    sendKeys(_randomString*(8) + '@gmail.com');
            }).then(function () {
                console.log('accessed');
            }).
            then(function () {
                return driver.
                    findElement(driver.webdriver.By.name('Password')).
                    sendKeys('123456');
            }).
            then(function () {
                return driver.
                    findElement(driver.webdriver.By.name('Confirm_password')).
                    sendKeys('123456');
            }).then(function () {
                driver.takeScreenshot().then(function (data) {
                    fs.writeFile('D:\\screenshots\\afterInput.png', data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
                        if (err) throw err;
                    });
                });
            }).then(function () {
                driver.wait(function () {
                    console.log('waiting reCaptcha...');
                    // return driver.isElementPresent(driver.webdriver.By.xpath("//div[@role='presentation']"));
                    return true;
                }, 50000);
            }).then(function () {
                // return driver.
                //     findElement(driver.webdriver.By.xpath("//div[@role='presentation']")).click();
                return true;
            }).then(function () {
                return driver.
                    findElement(driver.webdriver.By.id('acceptSubscribe')).
                    click();
            }).then(function () {
                return driver.
                    findElement(driver.webdriver.By.xpath("//button[@class='checkBeforeSubmit']")).click();
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

