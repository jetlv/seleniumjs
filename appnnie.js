/// <reference path="include.d.ts" />

var webdriver = require('selenium-node-webdriver');
var fs = require('fs');
var screen = require('./toolkits/screenshoter');
var json2csv = require('json2csv');
var async = require('async');



runAppnnie();
// setInterval(runAppnnie, 1000 * 100);    

function runAppnnie() {
    console.log('Mission started');
    webdriver().
        then(function (driver) {
            driver.get('https://www.appannie.com/account/login/?_ref=header').
                then(function () {
                    driver.manage().timeouts().implicitlyWait(5000);
                    driver.wait(function () {
                        console.log('waiting form...');
                        return driver.findElement(driver.webdriver.By.xpath("//form[@id='login-form']")).isDisplayed();
                    }, 20000);
                }).
                then(function () {
                    screen(driver, 'screenshots/firstScreen.png');
                    return driver.
                        findElement(driver.webdriver.By.xpath('//label[@for="email"]')).
                        sendKeys('jetlyu@aliyun.com');
                }).then(function () {
                    screen(driver, 'screenshots/emailEntered.png');
                }).
                then(function () {
                    return driver.
                        findElement(driver.webdriver.By.xpath('//label[@for="password"]')).
                        sendKeys('lc799110');
                }).
                then(function () {
                    screen(driver, 'screenshots/passwordEnteted.png');
                }).then(function () {
                    return driver.
                        findElement(driver.webdriver.By.id('submit')).click();
                }).then(function () {
                    driver.wait(function () {
                        console.log('waiting home page...');
                        screen(driver, 'screenshots/homePage.png');
                        return driver.isElementPresent(driver.webdriver.By.name('q'));
                    }, 50000);
                }).then(function () {
                    driver.get('https://www.appannie.com/apps/appletv/top-chart/united-states/overall/');
                }).then(function () {
                    return driver.
                        findElement(driver.webdriver.By.xpath('//a[@class="load-all"]')).
                        click();
                }).then(function () {
                    driver.wait(function () {
                        console.log('waiting data load...');
                        return driver.isElementPresent(driver.webdriver.By.xpath('//div[@class="aa-load-more-box"][@style="display: none;"]'));
                    }, 50000);
                    screen(driver, 'screenshots/loadedAll.png');
                }).then(function () {
                    var elements = driver.findElements(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr"));
                    return elements;
                }).
                then(function (elements) {
                    console.log(elements.length + ' lines total');
                    var rows = [];
                    var fields = ['Free', 'Paid', 'Popular'];
                    // for (var i=0; i<elements.length; i++) {
                    //     var num = i+1;
                    //     driver.findElement(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr[" + num +"]//td[1]//div[@class='main-info']//a[1]")).getText().then(function (free) {
                    //         return free;
                    //     }).then(function (free) {
                    //         driver.findElement(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr[" + num +"]//td[2]//div[@class='main-info']//a[1]")).getText().then(function (paid) {
                    //             return free + '|' + paid;
                    //         }).then(function (fp) {
                    //             driver.findElement(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr[" + num +"]//td[2]//div[@class='main-info']//a[1]")).getText().then(function (popular) {
                    //                 console.log(fp + '|' + popular);
                    //             });
                    //         });
                    //     })
                    // }
                    for (var i in elements) {
                        var e = elements[i], ra=[], free, paid, popular;


                        e.findElement(driver.webdriver.By.xpath(".//td[1]//div[@class='main-info']//a[1]")).getText().then(function(text) {
                            
                        });
                        e.findElement(driver.webdriver.By.xpath(".//td[2]//div[@class='main-info']//a[1]")).getText().then(function (text) {
                            
                        });
                        e.findElement(driver.webdriver.By.xpath(".//td[3]//div[@class='main-info']//a[1")).getText().then(function (text) {
                            popular = text;
                        });

                        
                        var r = { 'Free': free, 'Paid': paid, 'Popular': popular };
                        rows.push(r);
                        // console.log('free ' + free + ', paid ' + paid + ' ,popular ' + popular + ' got');
                    }
                    return [fields, rows];
                }).then(function (results) {
                    json2csv({ data: results[1], fields: results[0] }, function (err, csv) {
                        if (err) console.log(err);
                        fs.writeFile('csv/file.csv', csv, function (err) {
                            if (err) throw err;
                            console.log('file saved');
                        });
                    });
                }).then(function () {
                    driver.quit();
                    console.log('Mission completed');
                });
        });
}
