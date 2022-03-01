const { Client, Intents, MessageEmbed, WebhookClient } = require('discord.js');
const fs = require("fs");
const setTitle = require("console-title");
const request = require('request');
const r = require("readline-sync");

let i = 0;
let taken = 0;
let available = 0;
let deleted = 0;
let unavailable = 0;
let errors = 0;

const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ"
const webhookClient = new WebhookClient({ id: "", token: "" });

const usernames = [...new Set(fs.readFileSync("./usernames.txt", "utf-8").replace(/\r/g, "").split("\n"))]
check(usernames[i])

function check(username){
    if(username){
        if(username.includes(" ")){
            username = username.replace(" ", "_")
        }
    }
//    #00FF00
    if(i < usernames.length){
        const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${username}&xsrf_token=${xsrf_token}`

        request.post({
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
                "Cookie": `xsrf_token=${xsrf_token}`
            },
        }, async(err, body, res) => {
            if(err){
                unavailable++
                console.log(chalk.yellow("    [ERROR]: ") + chalk.red(`${username} has errored`))
            }else{
                try{
                    res = JSON.parse(res).reference.status_code
                    if(res == "TAKEN"){
                        taken++
                        const embed = new MessageEmbed()
	                    .setTitle('Snapchat Rare Username Checker | Username Taken')
                        .setDescription(`${username}`)
                        .setFooter('Snapchat Checker By UDXR & Socket')
	                    .setColor('#FF0000');

                        webhookClient.send({
	                        username: 'Snapchat ',
	                        avatarURL: 'https://media.discordapp.net/attachments/939900979661385808/948020218167427122/NodeLogo.png?width=676&height=676',
	                        embeds: [embed],
                        });
                    }else if(res == "OK"){
                        available++
                        const embed = new MessageEmbed()
	                    .setTitle('Snapchat Rare Username Checker | Username Avalible')
                        .setDescription(`${username}`)
                        .setFooter('Snapchat Checker By UDXR & Socket')
	                    .setColor('#00FF00');

                        webhookClient.send({
	                        username: 'Snapchat ',
	                        avatarURL: 'https://media.discordapp.net/attachments/939900979661385808/948020218167427122/NodeLogo.png?width=676&height=676',
	                        embeds: [embed],
                        });
                    }
                }catch(err){
                    errors++
                    console.log(err)
                }
            }

            await new Promise(resolve => setTimeout(resolve, 2000));//DO NOT CHANGE THE SLEEP INTERVAL
            i++
            check(usernames[i])
        })
    }else{
        r.question()
    }
}