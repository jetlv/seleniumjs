/// <reference path="include.d.ts" />

var webdriver = require('selenium-node-webdriver');
var fs = require('fs');
var screen = require('./toolkits/screenshoter');
var json2csv = require('json2csv');
var async = require('async');
var config = require('./config.js');

var rows = [];

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

runAppnnie();
setInterval(runAppnnie, 1000 * 60 * 60 * 24);

function runAppnnie() {
    // var tm = new Date();
    // var tmStr = tm.getFullYear().toString() + '_' + tm.getMonth() + '_' + tm.getDate().toString() + '_' + tm.getHours().toString() + '_' + tm.getMinutes().toString() + '_' + tm.getSeconds().toString();
    var tmStr = new Date().Format('yyyy_MM_dd_hh_mm_ss');
    console.log('Mission started at ' + tmStr);
    var sPath = 'screenshots/' + tmStr + '/';
    fs.mkdirSync(sPath);
    webdriver().
        then(function (driver) {
            driver.get('http://www.appannie.com/account/login/?_ref=header').
                // driver.get('http://www.baidu.com').
                then(function () {
                    // driver.manage().timeouts().implicitlyWait(5000);
                    console.log('phantomjs is running ...');
                    driver.wait(function () {
                        console.log('waiting form...');
                        return driver.findElement(driver.webdriver.By.xpath("//form[@id='login-form']")).isDisplayed();
                    }, 20000);
                }).
                then(function () {
                    screen(driver, sPath + 'firstScreen.png');
                    return driver.
                        findElement(driver.webdriver.By.xpath('//label[@for="email"]')).
                        sendKeys(config.username);
                }).then(function () {
                    screen(driver, sPath + 'emailEntered.png');
                }).
                then(function () {
                    return driver.
                        findElement(driver.webdriver.By.xpath('//label[@for="password"]')).
                        sendKeys(config.password);
                }).
                then(function () {
                    screen(driver, sPath + 'passwordEnteted.png');
                }).then(function () {
                    return driver.
                        findElement(driver.webdriver.By.id('submit')).click();
                }).then(function () {
                    driver.wait(function () {
                        console.log('waiting home page...');
                        screen(driver, sPath + 'homePage.png');
                        return driver.isElementPresent(driver.webdriver.By.name('q'));
                    }, 50000);
                }).then(function () {
                    driver.get('https://www.appannie.com/apps/appletv/top-chart/' + config.country + '/overall/?date=' + config.date);
                    // }).then(function () {
                    //     return driver.
                    //         findElement(driver.webdriver.By.xpath('//div[@data-name="country"]')).click();
                    // }).then(function () {
                    //         if(config.country) {
                    //             return driver.
                    //                 findElement(driver.webdriver.By.xpath('//span[@class="search-input"]/input')).sendKeys(config.country);
                    //         }
                    // }).then(function () {
                    //     return driver.
                    //         findElement(driver.webdriver.By.xpath('//a[@class="picker-option-button"]')).click();
                }).then(function () {
                    return driver.
                        findElement(driver.webdriver.By.xpath('//a[@class="load-all"]')).
                        click();
                }).then(function () {
                    driver.wait(function () {
                        console.log('waiting data load...');
                        return driver.isElementPresent(driver.webdriver.By.xpath('//div[@class="aa-load-more-box"][@style="display: none;"]'));
                    }, 50000);
                    screen(driver, sPath + 'loadedAll.png');
                }).then(function () {
                    var elements = driver.findElements(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr"));
                    return elements;
                }).
                then(function (elements) {
                    console.log(elements.length + ' lines total');
                    fs.writeFile('csv/' + tmStr + '.csv', '"Free","Paid","Popular"\r\n', function (err) {
                        if (err) throw err;
                        console.log('It\'s saved!');
                    });

                    for (var i in elements) {
                        var e = elements[i], ra = [], free, paid, popular;

                        e.findElement(driver.webdriver.By.xpath(".//td[1]//div[@class='main-info']//a[1]/parent::span")).getAttribute('title').then(function (title) {
                            fs.appendFileSync('csv/' + tmStr + '.csv', '"' + title + '",', { encoding: 'utf-8' }, function (err) {
                                if (err) throw err;

                            });
                        });


                        e.findElement(driver.webdriver.By.xpath(".//td[2]//div[@class='main-info']//a[1]/parent::span | .//td[2][@class='empty-cell']")).getAttribute('title').then(function (title) {
                            // console.log(title ? title : '');
                            fs.appendFileSync('csv/' + tmStr + '.csv', '"' + (title ? title : 'N0NE') + '",', { encoding: 'utf-8' }, function (err) {
                                if (err) throw err;
                            });

                        });

                        e.findElement(driver.webdriver.By.xpath(".//td[3]//div[@class='main-info']//a[1]/parent::span")).getAttribute('title').then(function (title) {
                            fs.appendFileSync('csv/' + tmStr + '.csv', '"' + title + '"\r\n', { encoding: 'utf-8' }, function (err) {
                                if (err) throw err;

                            });
                        });
                            ////do nothing put append empty string
                            // fs.appendFileSync('csv/' + tmStr + '.csv', '"",', { encoding: 'utf-8' });
                    }

                }).then(function () {
                    driver.quit();
                    console.log('Mission completed');
                });
        });
}
