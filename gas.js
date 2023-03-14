function checkGmail() {
  var properties = PropertiesService.getScriptProperties();
  var lastNotifiedThreadId = properties.getProperty('lastNotifiedThreadId');
  var threads = GmailApp.search('is:unread');
  var messagesToNotify = [];
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    if (lastNotifiedThreadId && thread.getId() <= lastNotifiedThreadId) {
      break;
    }
    var messages = thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var subject = message.getSubject();
      var sender = message.getFrom();
      var date = message.getDate();
      var body = message.getPlainBody();
      if (subject.indexOf('りんご') !== -1) {
        messagesToNotify.push('\n\n' + '件名▼\n'+ subject + '\n\n' + 'From▼\n' + sender + '\n\n' + '本文▼\n' + body);
      }
    }
  }
  if (messagesToNotify.length > 0) {
    var message = messagesToNotify.join('\n\n========================\n\n');
    sendLineNotification(message);
    properties.setProperty('lastNotifiedThreadId', threads[0].getId());
  }
}

function sendLineNotification(message) {
  var token = 'dHph4TmtGBNnjZ4ecMineNuUhG9JoLgjhIRpYIPWBdZ'; // LINE Notifyのアクセストークンを入力してください
  var options = {
    'method': 'post',
    'payload': 'message=' + message,
    'headers': {
      'Authorization': 'Bearer ' + token,
    }
  };
  var response = UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
  Logger.log(response.getContentText());
}
