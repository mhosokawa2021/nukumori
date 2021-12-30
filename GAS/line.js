let CHANNEL_ACCESS_TOKEN = 'line_channel_id';

function doPost(e) {
  let event = JSON.parse(e.postData.contents).events[0];
  let replyToken= event.replyToken;

  if (typeof replyToken === 'undefined') {
    return;
  }

  let userId = event.source.userId;
  let username = getUserName(userId);

  if(event.type == 'message') {
    let userMessage = event.message.text;
    let replyMessage = getChaplusMessage(userMessage, username);
    appendRow(userMessage);
    sendMessage(replyToken, replyMessage);
    return ContentService.createTextOutput(
      JSON.stringify({'content': 'ok'})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendMessage(replyToken, replyMessage) {
  let url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
     'headers': {
       'Content-Type': 'application/json; charset=UTF-8',
       'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
     },
     'method': 'post',
     'payload': JSON.stringify({
       'replyToken': replyToken,
       'messages': [{
         'type': 'text',
         'text': replyMessage,
       }],
     }),
   });
}

function getUserName(userId){ 
  let url = 'https://api.line.me/v2/bot/profile/' + userId;
  let userProfile = UrlFetchApp.fetch(url,{
    'headers': {
      'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(userProfile).displayName;
}

function getChaplusMessage(mes, username) {
  let dialogue_options = {
    'utterance': mes,
    'username' : username,
    'agentState' : {
      'agentName' : 'vai',
      'age' : '10歳',
      'tone' : 'dechu'
    }
  }
  let options = {
    'method': 'POST',
    'contentType': 'text/json',
    'payload': JSON.stringify(dialogue_options)
  };

  let chaplusUrl = "chaplus_apikey";
  let response = UrlFetchApp.fetch(chaplusUrl, options);
  let content = JSON.parse(response.getContentText());

  let answer = content.bestResponse.utterance;
  return answer;
}

function appendRow(text) {
  let spreadsheetId = "1Vkpzqr7aJCV7omi_YhqvBPGnscvHwFdMRe1k8o0advk";
  let sheetName = "talklog";
  let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);
  sheet.appendRow([new Date(),text]);
  return text;  
}