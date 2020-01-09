//
const fileReader = require('fs');
const path = require('path');

const helpMessages = JSON.parse( fileReader.readFileSync(path.join(__dirname, 'HelpMessages.json')) );

//
const GameHandler = require('./RPGGameHandler.js');
const game = new GameHandler();

//
const Discord = require('discord.js');
const client = new Discord.Client();

//  Events

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  let words = msg.content.split(" ");

  if (words[0] === '!poke') {

    // Base command.
    if(words[1] == undefined) {
      Greet(msg);
      return;
    }
    
    // Commands
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
      case "draw":
        //msg.channel.sendFile(game.Draw());
        Draw(msg);
      break;
    }

  }
});


//  Methods
async function Draw(msg) {

  let renderPromise = new Promise((resolve, reject) => {
    resolve(game.Draw());
  });
  renderPromise.then((value) => {
    let render = new Discord.Attachment(value, "GameState.png");
    msg.channel.send(render);
  });

}

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

client.login('NjY0NDEyMDY0MTE4MjEwNTcx.XhXTEA.845qtVq_ig8fBjM11OVJpIUWiGc');