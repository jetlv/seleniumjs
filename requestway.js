/// <reference path="./include.d.ts" />
var request = require('request');
var fs = require('fs');

function runScraping(country, category, date) {
    var appid_url = 'https://www.appannie.com/search/autocomplete/?top_n=10&q=' + exactName;
    var appid_har = {
        "url": appid_url,
        "method": "GET",
        "postData": {
            "text": "",
            "mimeType": ""
        },
        "headers": [{
            "name": "Host",
            "value": "www.appannie.com"
        },
            {
                "name": "Connection",
                "value": "keep-alive"
            },
            {
                "name": "Accept",
                "value": "*/*"
            },
            {
                "name": "X-NewRelic-ID",
                "value": "VwcPUFJXGwEBUlJSDgc="
            },
            {
                "name": "X-Requested-With",
                "value": "XMLHttpRequest"
            },
            {
                "name": "User-Agent",
                "value": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
            },
            {
                "name": "Referer",
                "value": "https://www.appannie.com/apps/ios/app/youtube/details/"
            },
            {
                "name": "Accept-Encoding",
                "value": "gzip, deflate, sdch, br"
            },
            {
                "name": "Accept-Language",
                "value": "zh-CN,zh;q=0.8"
            },
            {
                "name": "Cookie",
                "value": "km_lv=x; optimizelyEndUserId=oeu1467167446742r0.551292649479252; __distillery=4772024_388ca390-cd07-4210-a574-7776b8b268bc-5432af370-083f0e01b1d3-8326; welcome_carousel=1; optimizelySegments=%7B%222069170486%22%3A%22false%22%2C%222083860069%22%3A%22gc%22%2C%222083940003%22%3A%22direct%22%2C%223519320656%22%3A%22none%22%7D; optimizelyBuckets=%7B%7D; aa_language=cn; django_language=zh-cn; sessionId=\".eJxNzT1LA0EQxvHNGb1wGnz5CFbaHNaWptKgRXDAbpnbHZIl69ztzawaQbASAn5IG7-HBKLY_Xngx_NevKXBGRwLiYSWO-oliBLrGsbbzYpir1MDo4g8zzinh8IY4xjGFrMubBbqbfA335cHBg5_FTE2kfy0gCFK8Hewr63Y3HlU8qlYw8k_3aBbEnu4eKYGGeNKg5ManWszaz1BoWsWYgkanui29RSvtuIII_Vq3YLc0mp4JLc52ET1F2kHqvKrLAej0_Ll03Urfa0s3E-qNDyfpd2PWdrL9Q8b3F5Y:1bKxnu:JfM7W9wf6kSpvdoXHSYDKH2UqEk\"; __atuvc=8%7C26%2C19%7C27; csrftoken=sopF5B5rNSIjNb24PBMC80ZPetMsoSjZ; _ga=GA1.2.310534370.1467162140; _ceg.s=o9x7qj; _ceg.u=o9x7qj; _hp2_ses_props.3646280627=%7B%22ts%22%3A1467851907264%2C%22d%22%3A%22www.appannie.com%22%2C%22h%22%3A%22%2Faccount%2Flogin%2F%22%7D; _hp2_id.3646280627=2139846051771833.8535022489544476.2674386475627836; _bizo_bzid=2ec87d88-e925-4deb-8456-7ca5dc15645f; _bizo_cksm=66CDA39DE6084E48; _bizo_np_stats=6256%3D282%2C14%3D342%2C; kvcd=1467854445683; km_ai=jetlyu%40aliyun.com; km_ni=jetlyu%40aliyun.com; km_vs=1; km_uq=; aa_user_token=\".eJxrYKotZNQI5SxNLqmIz0gszihkClUwtUw2SLNMM002NUk0sLAwTbIwtzC1SLRISTMwSbY0MgwVik8sLcmILy1OLYpPSkzOTs1LKWQONShPTUrMS8ypLMlMLtZLTE7OL80r0XNOLE71zCtOzSvOLMksS_XNT0nNcYLqYQnlRTIpM6WQ1eupFQ9DqR4Aoukziw:1bKy0R:L8fNlYR8Uhxd4b18LAa5nW0bQDE\""
            }],
        "cookies": [{
            "name": "km_lv",
            "value": "x"
        },
            {
                "name": "optimizelyEndUserId",
                "value": "oeu1467167446742r0.551292649479252"
            },
            {
                "name": "__distillery",
                "value": "4772024_388ca390-cd07-4210-a574-7776b8b268bc-5432af370-083f0e01b1d3-8326"
            },
            {
                "name": "welcome_carousel",
                "value": "1"
            },
            {
                "name": "optimizelySegments",
                "value": "%7B%222069170486%22%3A%22false%22%2C%222083860069%22%3A%22gc%22%2C%222083940003%22%3A%22direct%22%2C%223519320656%22%3A%22none%22%7D"
            },
            {
                "name": "optimizelyBuckets",
                "value": "%7B%7D"
            },
            {
                "name": "aa_language",
                "value": "cn"
            },
            {
                "name": "django_language",
                "value": "zh-cn"
            },
            {
                "name": "sessionId",
                "value": "\".eJxNzT1LA0EQxvHNGb1wGnz5CFbaHNaWptKgRXDAbpnbHZIl69ztzawaQbASAn5IG7-HBKLY_Xngx_NevKXBGRwLiYSWO-oliBLrGsbbzYpir1MDo4g8zzinh8IY4xjGFrMubBbqbfA335cHBg5_FTE2kfy0gCFK8Hewr63Y3HlU8qlYw8k_3aBbEnu4eKYGGeNKg5ManWszaz1BoWsWYgkanui29RSvtuIII_Vq3YLc0mp4JLc52ET1F2kHqvKrLAej0_Ll03Urfa0s3E-qNDyfpd2PWdrL9Q8b3F5Y:1bKxnu:JfM7W9wf6kSpvdoXHSYDKH2UqEk\""
            },
            {
                "name": "__atuvc",
                "value": "8%7C26%2C19%7C27"
            },
            {
                "name": "csrftoken",
                "value": "sopF5B5rNSIjNb24PBMC80ZPetMsoSjZ"
            },
            {
                "name": "_ga",
                "value": "GA1.2.310534370.1467162140"
            },
            {
                "name": "_ceg.s",
                "value": "o9x7qj"
            },
            {
                "name": "_ceg.u",
                "value": "o9x7qj"
            },
            {
                "name": "_hp2_ses_props.3646280627",
                "value": "%7B%22ts%22%3A1467851907264%2C%22d%22%3A%22www.appannie.com%22%2C%22h%22%3A%22%2Faccount%2Flogin%2F%22%7D"
            },
            {
                "name": "_hp2_id.3646280627",
                "value": "2139846051771833.8535022489544476.2674386475627836"
            },
            {
                "name": "_bizo_bzid",
                "value": "2ec87d88-e925-4deb-8456-7ca5dc15645f"
            },
            {
                "name": "_bizo_cksm",
                "value": "66CDA39DE6084E48"
            },
            {
                "name": "_bizo_np_stats",
                "value": "6256%3D282%2C14%3D342%2C"
            },
            {
                "name": "kvcd",
                "value": "1467854445683"
            },
            {
                "name": "km_ai",
                "value": "jetlyu%40aliyun.com"
            },
            {
                "name": "km_ni",
                "value": "jetlyu%40aliyun.com"
            },
            {
                "name": "km_vs",
                "value": "1"
            },
            {
                "name": "km_uq",
                "value": ""
            },
            {
                "name": "aa_user_token",
                "value": "\".eJxrYKotZNQI5SxNLqmIz0gszihkClUwtUw2SLNMM002NUk0sLAwTbIwtzC1SLRISTMwSbY0MgwVik8sLcmILy1OLYpPSkzOTs1LKWQONShPTUrMS8ypLMlMLtZLTE7OL80r0XNOLE71zCtOzSvOLMksS_XNT0nNcYLqYQnlRTIpM6WQ1eupFQ9DqR4Aoukziw:1bKy0R:L8fNlYR8Uhxd4b18LAa5nW0bQDE\""
            }],
    }
    
    request({
        uri: this.appid_url,
        method: "GET",
        har: this.appid_har,
        gzip: true
    }, function (err, message, responseBody) {
        console.log(responseBody);
    });
}

var str = "https://static-s.aa-cdn.net/img/appletv/50600001000034/b95e4baa0634a69b2846710080066f41_w80";

console.log(str.match(/\d+/i)[0]);