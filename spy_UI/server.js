if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({path:'./.env'});
}


/* ------ LIBS ------ */
const express  = require('express')
const app = express()


const mongoose 		= require('mongoose')
const bodyParser 	= require('body-parser')
const expressLayout = require('express-ejs-layouts')
const server 		= require('http').createServer(app)
const path 			= require('path')
const io 			= require('socket.io').listen(server)


/* ------ SETUP ------ */
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to MongoDB'))


/* ------ ROUTES ------ */
const indexRouter = require('./routes/index')
const apiRouter   = require('./routes/api')
app.use('/', indexRouter)
app.use('/api', apiRouter)


/* Socket */
// TODO: Send more info to browser about how many new items have
//		 been added, duration, etc
io.on('connection', function(socket) {
	console.log('a user connected')

	socket.on("disconnect", reason => {
		console.log("A user just disconnected")
	})

	socket.on("b_cmd", cmd => {

		console.log("B_CMD: " + cmd)

		// Send command to phone
		socket.broadcast.emit("p_cmd", cmd)
	})

	socket.on("p_msg", msg => {

		console.log("P_MSG: " + msg)

		// Send feedback to browser
		socket.broadcast.emit("b_msg", msg)
	})
})


server.listen(process.env.PORT || 8000)
