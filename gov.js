/// <reference path="include.d.ts" />

var webdriver = require('selenium-node-webdriver');
var fs = require('fs');
var screen = require('./toolkits/screenshoter');
var json2csv = require('json2csv');
var async = require('async');

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
// setInterval(runAppnnie, 1000 * 60 * 60 * 24);    

function runAppnnie() {
    // var tm = new Date();
    // var tmStr = tm.getFullYear().toString() + '_' + tm.getMonth() + '_' + tm.getDate().toString() + '_' + tm.getHours().toString() + '_' + tm.getMinutes().toString() + '_' + tm.getSeconds().toString();
    var tmStr = new Date().Format('yyyy_MM_dd_hh_mm_ss');
    console.log('Mission started at ' + tmStr);
    var sPath = 'screenshots/' + tmStr + '/';
    fs.mkdirSync(sPath);
    webdriver().
        then(function (driver) {
            driver.get('https://procure.az.gov/bso/external/publicBids.sdo').
                // driver.get('http://www.baidu.com').
                then(function () {
                    // driver.manage().timeouts().implicitlyWait(5000);
                    console.log('phantomjs is running ...');
                    driver.wait(function () {
                        console.log('waiting for table...');
                        return driver.findElement(driver.webdriver.By.xpath("//table[@id='resultsTable']")).isDisplayed();
                    }, 20000);
                }).
                then(function () {
                    screen(driver, sPath + 'result.png');
                    // var length = driver.findElements(driver.webdriver.By.xpath("//table[@id='resultsTable']/tbody/tr")).length();
                    // for (var i = 1; i < length + 1; i++) {
                    //     fs.writeFileSync(sPath + 'result.sql', 'insert into table results values(');
                    //     driver.findElement(driver.webdriver.By.xpath("//table[@id='resultsTable']/tbody/tr[" + i + "]/td/a")).getText().then(function (text) {
                    //         fs.appendFileSync(sPath + 'result.sql', '"' + text + '"');

                    //     });
                    // }

                     var length = driver.findElements(driver.webdriver.By.xpath("//table[@id='resultsTable']/tbody/tr")).length;
                     console.log(length);
                     for(var i=1; i < length; i++) {
                         fs.writeFileSync(sPath + 'result.sql', 'insert into table results values(');
                         var cells = driver.findElements(driver.webdriver.By.xpath("//table[@id='resultsTable']/tbody/tr[" + i + "]/td/a"));
                         console.log(cells.length);
                         for(var j=0; j < cells.length; j++) {
                             cells.getText().then(function(text) {
                                 console.log(text);
                                 fs.appendFileSync(sPath + 'result.sql', '"' + text + '"')
                                 if(j !== cells.length -1) {
                                    fs.appendFileSync(sPath + 'result.sql', ',');
                                 } else {
                                    fs.appendFileSync(sPath + 'result.sql', ')');
                                 }
                             });
                         }

                    }
                }).then(function () {
                    driver.quit();
                    console.log('Mission completed');
                });
        });
}
