const fileReader = require('fs');
const path = require('path');

const helpMessages = JSON.parse( fileReader.readFileSync(path.join(__dirname, 'HelpMessages.json')) );

const Discord = require('discord.js');
const client = new Discord.Client();


//  Events

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  let words = msg.content.split(" ");

  if (words[0] === '!poke') {

    if(words[1] == undefined) {
      Greet(msg);
      return;
    }
    
    switch(words[1]) {
      case "stop":
        Terminate();
      break;
      case "move": //WIP
        if(words[2] == undefined) {
          MovePlayer(msg);
          return;
        }
      break;
      case "inventory":
        OpenInventory(msg.author, msg.channel);
      break;
    }

  }
});


//  Methods

function MovePlayer(message, direction = "none") {
  if (direction === "none") {
    message.channel.send(helpMessages.moveHelp);
  }
}

function OpenInventory(user, channel) {
  channel.send("Showing inventory of " + user + "!~");
}

function Greet(message) {
  message.channel.send("Henlo "+message.author+"!");
}

function Terminate() {
  client.user.setStatus('invisible');
  process.exit();
}


// Start

client.login('NjY0NDEyMDY0MTE4MjEwNTcx.XhWs5A.zfOpEF_G6j18PT-3zHSDLyEI1RY');