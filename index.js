require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

/**
 * Checks any incoming message to see if it starts
 * with the chosen prefix
 * @param {string} message The incoming message
 * @returns null if message doesn't start with prefix, message without prefix otherwise.
 */
const checkMessage = (message) => {
  return (message.startsWith('.'))
    ? message.slice(1).split(' ')
    : null
}

const replyToMessage = (reply, userMessage) => {
  userMessage.reply(reply)
  .then((message) => message.delete(7500))
  userMessage.delete()
}

client.on('ready', () => {
  console.log('Up and running!')
})

client.on('message', message => {
  let checkedMessage = checkMessage(message.content)
  if (checkedMessage) {
    switch (checkedMessage[0]) {
      case 'ping': {
        replyToMessage('pong!', message)
        break
      } case 'subscribe': {
        if (message.channel.name === 'bot-spam') {
          let roles = message.guild.roles
          checkedMessage.shift() // Removing first element from array (the command)
          let requestedRoles = checkedMessage
          let user = message.member

          let addedRoles = []

          roles.forEach((role) => {
            for (var i = 0, len = requestedRoles.length; i < len; i++) {
              // Checking against all roles and making sure it isn't a member/admin role.
              if (role.name.slice(0, -1).toLowerCase() === requestedRoles[i].toLowerCase() && role.name.substr(-1) === '*') {
                addedRoles.push(role)
              }
            }
          })

          if (addedRoles.length > 0) {
            user.addRoles(addedRoles, 'Requested via CS Bot.')
            replyToMessage('Added roles: \n' + addedRoles.map(role => role.name).join('\n'), message)
          } else {
            replyToMessage('No acceptable roles found. Please double-check spelling!', message)
          }
        } else {
          replyToMessage('Please use #bot-spam', message)
        }
        break
      } case 'unsubscribe': {
        if (message.channel.name === 'bot-spam') {
          let roles = message.guild.roles
          checkedMessage.shift() // Removing first element from array (the command)
          let requestedRoles = checkedMessage
          let user = message.member

          let removedRoles = []

          roles.forEach((role) => {
            for (var i = 0, len = requestedRoles.length; i < len; i++) {
              // Checking against all roles and making sure it isn't a member/admin role.
              if (role.name.slice(0, -1).toLowerCase() === requestedRoles[i].toLowerCase() && role.name.substr(-1) === '*') {
                removedRoles.push(role)
              }
            }
          })

          if (removedRoles.length > 0) {
            user.addRoles(removedRoles, 'Requested via CS Bot.')
            replyToMessage('Removed roles: \n' + removedRoles.map(role => role.name.slice(0, -1)).join('\n'), message)
          } else {
            replyToMessage('No acceptable roles found. Please double-check spelling!', message)
          }
        } else {
          replyToMessage('Please use #bot-spam', message)
        }
        break
      } case 'list': {
        if (message.channel.name === 'bot-spam') {
          let roles = message.guild.roles
          let acceptableRoles = []
          roles.forEach((role) => {
            if (role.name.substr(-1) === '*') { acceptableRoles.push(role.name.slice(0, -1)) }
          })
          replyToMessage('Acceptable roles: \n' + acceptableRoles.join('\n'), message)
        } else {
          replyToMessage('Please use #bot-spam', message)
        }
        break
      }
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
