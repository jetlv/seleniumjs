/// <reference path="include.d.ts" />

var webdriver = require('selenium-node-webdriver');
var fs = require('fs');
var screen = require('./toolkits/screenshoter');


console.log('Misson started');
webdriver().
    then(function (driver) {
        driver.get('https://www.appannie.com/account/login/?_ref=header').
            then(function () {
                driver.manage().timeouts().implicitlyWait(5000);
                driver.wait(function () {
                    console.log('waiting form...');
                    return driver.findElement(driver.webdriver.By.xpath("//form[@id='login-form']")).isDisplayed();
                }, 10000);
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
            }).then(function() {
                screen(driver, 'screenshots/loadedAll.png'); 
            }).
            then(function () {
                return driver.
                    findElement(driver.webdriver.By.xpath('//div[@class="aa-load-more-box"]')).
                    click();
            }).then(function () {
                var elements = driver.findElements(driver.webdriver.By.xpath("//tbody[@id='storestats-top-table']/tr"));
                return elements;
            }).
            then(function (elements) {
                console.log(elements.length);
                driver.quit();
            });
    });
