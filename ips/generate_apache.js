const fs = require('fs');
let dataIn = fs.readFileSync("ips.txt").toString();
let data = dataIn.trim().split(/\r\n|\r|\n/);

let handle = fs.openSync("apache_ips.txt",'w+' );
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
    fs.writeSync(handle, data+" -\r\n");
}

function writeGroup(start, end, handle) {
    let startIps = start.trim().split(".");
    let endIps = end.trim().split(".");

    if (startIps.length != endIps.length && startIps.length != 4) {
        console.log("Invalid ip", start, end);
        return;
    }

    for (let i=0;i<startIps.length;i++) {
        startIps[i] = parseInt(startIps[i], 10);
        endIps[i] = parseInt(endIps[i], 10);
    }


    for (let ip1=startIps[0];ip1<=endIps[0];ip1++) {
        for (let ip2=startIps[1];ip2<=endIps[1];ip2++) {
            for (let ip3=startIps[2];ip3<=endIps[2];ip3++) {
                for (let ip4=startIps[3];ip4<=endIps[3];ip4++) {
                    let ip = ip1+"."+ip2+"."+ip3+"."+ip4;
//                    console.log("ip", ip);
                    writeLine(ip, handle);
                }
            }
        }
    }

}