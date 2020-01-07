const fileReader = require('fs');
const helpMessages = JSON.parse( fileReader.readFileSync('HelpMessages.json') );

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

client.login('NjUyNjQ0Mjg1NDA1MjAwMzk1.Xer2ig.yIWJzj1T8RAxGXsb4L8qqYNU6N4');