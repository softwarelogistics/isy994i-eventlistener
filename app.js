var WebSocketClient = require('websocket').client;
var parseString = require('xml2js').parseString;

const fs = require('fs')

console.log("WS App Started.");

var client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});


function resolveControlType(ctlType) {
    console.log(ctlType);
    switch (ctlType) {
        case "ST": return 'DeviceStatus';
        case "_0": return 'HeartBeat';
        case "_1": return 'Trigger';
        case "_2": return 'DeviceSpecific';
        case "_3": return 'NodeChanged';
        case "_4": return 'SystemConfigUpdated';
        case "_5": return 'SystemStatusUpdated';
        case "_6": return 'InternetAccess';
        case "_7": return 'ProgressReport';
        case "_8": return 'SecuritySystemEvent';
    }

    return ctlType;
}

function resolveAction(action) {
    switch (action) {

        case "0": return 'EventStatus';
        case "1": return 'GetStatus';
        case "2": return 'KeyChanged';
        case "3": return 'InfoString';
        case "4": return 'IRLearnMode';
        case "5": return 'ScheduleStatusChanged';
        case "6": return 'VariableStatusChanged';
        case "7": return 'VariableInitialized';
        case "8": return 'Key';
    }

    return action;
}

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const xml = message.utf8Data;
            console.log(xml);

            const data = fs.writeFileSync('out.xml', xml, { flag: 'a+' }, )
            /*
            parseString(xml, function (err, result) {
                const evt = result.Event;
                if (evt) {
                    if (evt.node) {
                        console.log(evt.node[0] + ' Control Type=' + resolveControlType(evt.control[0]) + ' Action=' + resolveAction(evt.action[0]));
                        console.log(evt);
                    }
                }
                //console.dir(JSON.stringify(result));
            });*/
        }
    });

    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});

var auth = "kevinw:My17Day!";
const creds = Buffer.from(auth).toString('base64')
console.log(creds);
const headers = {
    'Authorization': 'Basic ' + creds
};

console.log(headers);

client.connect('ws://10.1.1.17/rest/subscribe:My17Day@kevinw', 'ISYSUB', "com.universal-devices.websockets.isy", headers);