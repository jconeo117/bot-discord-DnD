import { Client, Message } from "discord.js";

import fs from 'fs';
import path from 'path';


export async function commandLoader(client:Client, message:Message, command:string, args:string[]) {
  try {

    const __dirname = path.resolve();
    
    const carpetaCommand = path.join(__dirname, 'src/commands');

    const commandFiles = fs.readdirSync(carpetaCommand);

    for (const file of commandFiles) {
      const { run, help } = require(`./../commands/${file}`); // Reemplazado el import

      if (command === help.name || (Array.isArray(help.name) && help.name.includes(command))) {
        run(client, message, args, command);
        break;
      }
    }
  } catch (error) {
    console.error('Error al cargar comandos:', error);
  }
}

