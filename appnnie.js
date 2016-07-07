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

var first = config.basic.startDate;
var last = config.basic.endDate;
var f_date = new Date(first);
var l_date = new Date(last);
var dates = [];
while (f_date <= l_date) {
    dates.push(f_date.Format('yyyy-MM-dd'));
    f_date.setDate(f_date.getDate() + 1);
}



runAppnnie(config.countries, config.categories, dates);
// runAppnnie([{ slug: 'benin', code: 'BE' }, { slug: 'united-states', code: 'US' }], ['overall', 'lifestyle'], ['2016-07-07']);
// setInterval(runAppnnie, 1000 * 60 * 60 * 24);

function runAppnnie(countries, categories, dates) {
    var sqlbase = 'insert into app_rank (app_id, rank, rank_date, rank_type, country, category) values';
    var tmStr = new Date().Format('yyyy-MM-dd-hh-mm-ss');
    console.log('Mission started at ' + tmStr);
    // var sPath = 'screenshots/' + tmStr + '/';
    // fs.mkdirSync(sPath);
    dates.forEach(function (date) {
        countries.forEach(function (country) {
            try {
                categories.forEach(function (category) {
                    try {
                        console.log('Start fetching ' + country.slug + ' and ' + category);
                        webdriver().
                            then(function (driver) {
                                driver.get('http://www.appannie.com/account/login/?_ref=header').
                                    then(function () {
                                        // driver.manage().timeouts().implicitlyWait(5000);
                                        console.log('phantomjs is running ...');
                                        driver.wait(function () {
                                            console.log('waiting form ...');
                                            return driver.isElementPresent(driver.webdriver.By.xpath("//form[@id='login-form']"));
                                        }, 1000 * 60 * 3);

                                    }).
                                    then(function () {
                                        // screen(driver, sPath + 'firstScreen.png');
                                        return driver.
                                            findElement(driver.webdriver.By.xpath('//label[@for="email"]')).
                                            sendKeys(config.basic.username);
                                    }).then(function () {
                                        // screen(driver, sPath + 'emailEntered.png');
                                    }).
                                    then(function () {
                                        return driver.
                                            findElement(driver.webdriver.By.xpath('//label[@for="password"]')).
                                            sendKeys(config.basic.password);
                                    }).
                                    then(function () {
                                        // screen(driver, sPath + 'passwordEnteted.png');
                                    }).then(function () {
                                        return driver.
                                            findElement(driver.webdriver.By.id('submit')).click();
                                    }).then(function () {
                                        driver.wait(function () {
                                            console.log('waiting home page...');
                                            // screen(driver, sPath + 'homePage.png');
                                            return driver.isElementPresent(driver.webdriver.By.name('q'));
                                        }, 1000 * 60 * 3);
                                    }).then(function () {
                                        driver.get('https://www.appannie.com/apps/appletv/top-chart/' + country.slug + '/' + category + '/?date=' + date);
                                        console.log('getting ' + 'https://www.appannie.com/apps/appletv/top-chart/' + country.slug + '/' + category + '/?date=' + date);
                                        // }).then(function () {
                                        // driver.wait(function () {
                                        //     console.log('waiting load icon...');
                                        //     return driver.isElementPresent(driver.webdriver.By.xpath('//a[@class="load-all"]'));
                                        // }, 1000 * 60 * 3).catch(function(err) {
                                        //      console.log('no loading icon here');
                                        //      return;
                                        // });
                                    }).then(function () {
                                        return driver.
                                            findElement(driver.webdriver.By.xpath('//a[@class="load-all"]')).then(function (element) {
                                                element.click();
                                                return true;
                                            }, function (err) {
                                                console.log('this page has no data');
                                                return false;
                                            });
                                    }).then(function (shallIrun) {
                                        console.log(shallIrun);
                                        if (shallIrun) {
                                            driver.wait(function () {
                                                console.log('waiting data load...');
                                                return driver.isElementPresent(driver.webdriver.By.xpath('//div[@class="aa-load-more-box"][@style="display: none;"]'));
                                            }, 1000 * 60 * 3);
                                        }
                                        // screen(driver, sPath + 'loadedAll.png');
                                    }).then(function () {
                                        var elements = driver.findElements(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr"));
                                        return elements;
                                    }).
                                    then(function (elements) {
                                        console.log(date + '-' + country.slug + '-' + category + '-' + elements.length + ' lines total');
                                        // fs.writeFile('sql/' + tmStr + '.sql', '"Free","Paid","Popular"\r\n', function (err) {
                                        //     if (err) throw err;
                                        //     // console.log('It\'s saved!');
                                        // });

                                        elements.forEach(function (e, i, arr) {


                                            var e = elements[i], ra = [], free, paid, popular;

                                            e.findElement(driver.webdriver.By.xpath(".//td[1]//div[@class='main-info']//a[1]/parent::span | .//td[1][@class='empty-cell']")).getAttribute('title').then(function (title) {
                                                if (title) {
                                                    e.findElement(driver.webdriver.By.xpath("..//td[1]//a[@class='icon-link']/img")).getAttribute('src').then(function (src) {
                                                        var rank = i + 1;
                                                        var rank_type = 'Free';
                                                        var app_id = src.match(/\d+/i)[0];
                                                        //app_id, rank, date, rank_type, country, category
                                                        fs.appendFileSync('sql/' + tmStr + '.sql', sqlbase + '("' + app_id + '","' + rank + '","' + date + '","' + rank_type + '","' + country.code + '","' + category + '");\r\n', { encoding: 'utf-8' }, function (err) {
                                                            if (err) throw err;

                                                        });
                                                    });


                                                }
                                            });

                                            e.findElement(driver.webdriver.By.xpath(".//td[2]//div[@class='main-info']//a[1]/parent::span | .//td[2][@class='empty-cell']")).getAttribute('title').then(function (title) {
                                                if (title) {
                                                    e.findElement(driver.webdriver.By.xpath("..//td[2]//a[@class='icon-link']/img")).getAttribute('src').then(function (src) {
                                                        var rank = i + 1;
                                                        var rank_type = 'Paid';
                                                        var app_id = src.match(/\d+/i)[0];
                                                        //app_id, rank, date, rank_type, country, category
                                                        fs.appendFileSync('sql/' + tmStr + '.sql', sqlbase + '("' + app_id + '","' + rank + '","' + date + '","' + rank_type + '","' + country.code + '","' + category + '");\r\n', { encoding: 'utf-8' }, function (err) {
                                                            if (err) throw err;

                                                        });
                                                    });


                                                }

                                            });
                                            e.findElement(driver.webdriver.By.xpath(".//td[3]//div[@class='main-info']//a[1]/parent::span | .//td[3][@class='empty-cell']")).getAttribute('title').then(function (title) {
                                                if (title) {
                                                    e.findElement(driver.webdriver.By.xpath("..//td[3]//a[@class='icon-link']/img")).getAttribute('src').then(function (src) {
                                                        var rank = i + 1;
                                                        var rank_type = 'Grossing';
                                                        var app_id = src.match(/\d+/i)[0];
                                                        //app_id, rank, date, rank_type, country, category
                                                        fs.appendFileSync('sql/' + tmStr + '.sql', sqlbase + '("' + app_id + '","' + rank + '","' + date + '","' + rank_type + '","' + country.code + '","' + category + '");\r\n', { encoding: 'utf-8' }, function (err) {
                                                            if (err) throw err;

                                                        });
                                                    });


                                                }
                                            });
                                            ////do nothing put append empty string
                                            // fs.appendFileSync('csv/' + tmStr + '.csv', '"",', { encoding: 'utf-8' });
                                        });

                                    }).then(function () {
                                        driver.quit();
                                        console.log('Mission completed');
                                    });
                            });
                    } catch (err) {
                        fs.appendFileSync('error.txt', err + '\r\n');
                        fs.appendFileSync('error.txt', err.stack + '\r\n');
                        return;
                    }
                });
            } catch (err) {
                fs.appendFileSync('error.txt', err + '\r\n');
                fs.appendFileSync('error.txt', err.stack + '\r\n');
                return;
            }
        });
    });
}
