    import Express = require('express');
    import Cors = require('cors');
    import Dotenv = require('dotenv')
    import Fs = require('fs')
    const Qr = require('qrcode')
    const { Client, NoAuth } = require('whatsapp-web.js')
    Dotenv.config()

    let connected = 0;
    let whaqr: any;
    let message: any;
    let messages: any[] = [];
    const client = new Client({
        authStrategy: new NoAuth()
    })
    // Variaveis ETC (Edite Para Configurar)
    console.log("Servidor VickWEB (API/BACKEND)")
    console.log("")

    client.on("qr", (qr: any) => {
        whaqr = qr
        console.log("Waiting Connection...")
        messages.push({ form: "INFO", type: "text", body: "Espere/Escaneie O QR Code"})
    })
    const url = process.env.URL || "localhost"
    const porta = process.env.PORTA || 3001
    console.log("Set Vars!")
    // Vars FIM
    client.on("ready", () => {
        message = `Whatsapp Loading`
        console.log("LOADING...")
        messages.push({ form: "INFO", type: "text", body: "Conected!"})
        whaqr = ""
	connected = 1
    })

    client.on("message", async (msg: any) => {
        const contato = await msg.getContact()
        try {
            if (msg.hasMedia) {
            const media = await msg.downloadMedia()
            messages.push({ from: contato.pushname || contato.number, type: "media", mimetype: media.mimetype, filename: media.filename, data: media.data})
            } else {
                messages.push({ from: contato.pushname + " | " + contato.number, type: "text" , body: msg.body })
            }
        } catch (err) {
            messages.push({ from: "ERROR", type: "text" , body: "the message not send due to an error" })
        }
        
    })
    const app = Express()
    app.use(Cors());
    app.use(Express.json());
    console.log("WEB LOADED!")
    // Connection Server
    app.get("/ping", (req, res) => {
        res.json({ msg: "Conected!" });
    });
    app.get("/qr", (req, res) => {
        if (!whaqr) {
            return res.send("403")
        } 
        res.setHeader("Content-Type", "image/png")
        Qr.toFileStream(res, whaqr)
    })
    app.get("/logout", (req, res) => {
	if (connected == 1) {
        client.destroy().then(() => {
            Fs.rmSync('./../.wwebjs_auth', { recursive: true, force: true });
	    connected = 0
            client.initialize()
            messages.push({ form: "INFO", type: "text", body: "Logout!"})
        })
    	} else {
	    messages.push({ form: "INFO", type: "text", body: "Already Logouted!"})
	} 
    })
    app.post("/env", async (req, res) => {
        if (req.body) {
        const { numero, mensagem } = req.body
        if (!numero || !mensagem) {
            messages.push({ form: "ERROR", type: "text", body: "Number or Message Empty!" })
        } else {
            if (connected == 1) {
            try {
                await client.sendMessage(numero + "@c.us", mensagem)
                messages.push({ form: "INFO", type: "text", body: "Message Sended! Number:" + numero + "." })
            } catch (err) {
                messages.push({ form: "ERROR", type: "text", body: "ERROR WHILE TRYING TO SEND MESSAGE" })
            }
            } else {
                messages.push({ form: "ERROR", type: "text", body: "NOT CONNECTED" })
            }
        }
        }
    })
    app.get("/msg", (req, res) => {
        res.json(messages)
    })
    app.post("/clear", (req, res) => {
        messages = []
    })
    console.log("URL Loaded!")
    console.log("")
    console.log("")
    console.log("")
    app.listen(porta, () => {
        console.log(`Started With Success! Port:${porta}, URL localhost`)
        console.log("MENSAGEM DO SERVIDOR:")
        console.log("Algumas Vezes, o Codigo Falha com Sucesso")
    });
    client.initialize()
