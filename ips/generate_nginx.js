"use strict";

const fs = require('fs');
let dataIn = fs.readFileSync("ips.txt").toString();
let data = dataIn.trim().split(/\r\n|\r|\n/);

let handle = fs.openSync("nginx_ips.txt",'w+' );
for (let i=0;i<data.length;i++) {
    let offset = data[i].indexOf("#");
    if (offset === 0) { continue; }  // Single line comment
    if (offset > 0) {
        data[i] = data[i].substr(0, offset).trim();
    }
    offset = data[i].indexOf("-");
    if (offset < 1) {
        writeLine(data[i], handle);
    }  else {
        let x = data[i].split("-");
        writeGroup(x[0], x[1], handle);
    }
}

fs.closeSync(handle);
console.log("Done");

function writeLine(data, handle) {
    fs.writeSync(handle, data+"\r\n");
}

function writeGroup(start, end, handle) {
    writeLine(ipcidr(start,end), handle);
}

function ip2long(ip) {
    let sep = ip.split(".");
    let value = (parseInt(sep[0],10) * 16777216) + (parseInt(sep[1],10) * 65536) + (parseInt(sep[2],10) * 256) + parseInt(sep[3],10);
    return value;
}

function long2ip(value) {
    let octs = "." + (value & 255);
    let nextvalue = value >> 8;
    octs = "." + (nextvalue & 255) + octs;
    nextvalue = nextvalue >> 8;
    octs = "." + (nextvalue & 255) + octs;
    nextvalue = nextvalue >> 8;
    octs = (nextvalue & 255) + octs;
    return octs;
}



function ipcidr(start, end) {
    let cidrArray = {};

    if (typeof cidrArray == 'undefined' || typeof cidrArray[1] == 'undefined') {
        cidrArray = {4294967295: "/1"};
        let num = 2147483647;
        for (let i=1;i<=32;i++) {
            cidrArray[num] = "/"+i;
            num = (num >> 1);
        }

    }
   var diffNum = ip2long(end)-ip2long(start);
    return start.trim()+cidrArray[diffNum];
}