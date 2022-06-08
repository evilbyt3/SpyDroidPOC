const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Phone = require('../models/Phone')

// Show all the Phones
router.get("/phones", async (req, res) => {
	try {
		const phones = await Phone.find()
		res.status(200).json({
				count: phones.length,
				phones: phones
			})
		}
	catch (e) {
		// TODO: Log error
		// console.log(e)
		res.status(500).json({error: e})
	}
})

// Show a specific phone
router.get("/:phoneID", async (req, res) => {
	try {
		const phone = await Phone.findById(req.params.phoneID)
		if (phone) {
			res.status(500).json({
				message: "Phone found",
				phone: phone
			})
		}
		else {
			res.status(404).json({message: "Phone not found"})
		}
	}
	catch (e) {
		// Log the error
		res.status(500).json({
			message: "Phone not found",
			error: e
		})
	}
})

// Create a new Phone instance
router.post('/phone/new', (req, res) => {
	console.log(req.body.imei)

	Phone.find({
		"imei": { $in: req.body.imei }
	}, async function(err, docs) {
		// Create new phone instance only if the IMEI is unique
		if (docs.length == 0) {
			const phone = new Phone({
				_id: new mongoose.Types.ObjectId(),
				imei: req.body.imei,
				total_apps: 0,
				total_contacts: 0,
				total_callLogs: 0,
				total_SMS:  0,
				total_events: 0,
				phone_data: new Map()
			})

			try {
				const newPhone = await phone.save()	
				res.json({"success": "true", "id": phone._id})
			}
			catch (e) {
				// TODO: Log the error
				console.log(e)
				res.json({"success": "false"})
			}
		}
		else {
			console.log(err)
			res.json({"success": "false"})
		}
	})

})

// Delete a Phone
router.delete("/:phoneID", async (req, res) => {
	try {
		const result = await Phone.deleteOne({ _id: req.params.phoneID })
		res.status(200).json({
			message: "Phone deleted",
			result: result,
			success: true
		})
	}
	catch (e) {
		res.status(500).json({message: "Phone not deleted", success: false})
	}
})

// Update a Phone
router.post("/:phoneID", async (req, res) => {
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.key] = ops.val
	}

	// console.log(updateOps);

	try {
		const phone = await Phone.updateOne(
			{ _id:  req.params.phoneID },
			{ $set: updateOps }
		)
		res.status(200).json({
			message: "Phone updated",
			result: phone,
			success: true
		})
	}
	catch (e) {
		res.status(500).json({
			message: "Phone not updated",
			error: e,
			success: false
		})
	}

})

// Add an event
router.post("/:phoneID/event", (req, res) => {
	const event = {
		title:          req.body.title,
		location:       req.body.location,
		timezone:       req.body.timezone,
		description:    req.body.description,
		calendar_acc:   req.body.calendar_acc,
		start:          req.body.start,
		end:            req.body.end
	}

	add_to_phone_array(res, req.params.phoneID, event, "event")
});

// Add an app
router.post("/:phoneID/app", (req, res) => {
	const app = {
		app_name: req.body.app_name,
		app_pkg:  req.body.app_pkg,
		apk_path: req.body.apk_path
	}

	add_to_phone_array(res, req.params.phoneID, app, "app")
})


// Add a SMS 
// TODO: What is the phone is not having +40 at the beginning
//		 Parse this
router.post("/:phoneID/sms", async (req, res) => {
	const SMS = {
		address:	req.body.address,
		content:	req.body.content,
		date:		req.body.date,
		read:		req.body.read,
		type:		req.body.type
	}

	let s = await check_for_duplicates(SMS, "sms")
	// console.log(s)
	if (s) {
		res.send("Duplicate found, not adding it to DB")
	}
	else {
		// res.send("Duplicate not found, adding it to DB")
		add_to_phone_array(res, req.params.phoneID, SMS, "sms")
	}
})


// Add a contact
// TODO: Check for unique phone number
router.post("/:phoneID/contact", async (req, res) => {
	const contact = {
		name:	req.body.name,
		phone:	req.body.phone.replace(/\s/g, ''),
	}

	let s = await check_for_duplicates(contact, "contact")
	// console.log(s)
	if (s) {
		res.send("Duplicate found, not adding it to DB")
	}
	else {
		// res.send("Duplicate not found, adding it to DB")
		add_to_phone_array(res, req.params.phoneID, contact, "contact")
	}
})

// Add a call log
router.post("/:phoneID/call_log", async (req, res) => {
	const call_log = {
		phone_nr:	req.body.phone_nr.replace(/\s/g, ''),
		call_date:	req.body.call_date,
		call_type:	req.body.call_type,
		call_duration:	req.body.call_duration
	}

	let s = await check_for_duplicates(call_log, "call_log")
	// console.log(s)
	if (s) {
		res.send("Duplicate found, not adding it to DB")
	}
	else {
		// res.send("Duplicate not found, adding it to DB")
		add_to_phone_array(res, req.params.phoneID, call_log, "call_log")
	}
})


// Returns true if duplicates found
async function check_for_duplicates(object, type) {
	try {
		let status = false
		const phones = await Phone.find({})
		for (phone of phones) {
			switch(type) {
				case "sms":
					for (sms of phone.SMS) {
						if (object.address == sms.address && 
							object.date == sms.date) {
								status = true
								return status
							}
					}
					break
				case "contact":
					for (contact of phone.contacts) {
						if (object.name == contact.name &&
							object.phone == contact.phone) {
								status = true
								return status
							}
					}
					break
				case "call_log":
					for (c_log of phone.callLogs) {

						if (object.phone_nr == c_log.phone_nr &&
							object.call_date == c_log.call_date &&
							object.call_type == c_log.call_type &&
							object.call_duration == c_log.call_duration) {
								status = true
								return status
							}
					}
					break
			}
		}
		return status
	}
	catch (e) {
		console.log(`[!] Error in duplicates: ${e}`)
		return true
	}
}

async function add_to_phone_array(res, id, object, type) {
	try {
		const phone = await Phone.findById(id)
		switch(type) {
			case "sms":
				phone.SMS.push(object)
				phone.total_SMS += 1
				break
			case "app":
				phone.apps.push(object)
				phone.total_apps += 1
				break
			case "contact":
				phone.contacts.push(object)
				phone.total_contacts += 1
				break
			case "call_log":
				phone.callLogs.push(object)
				phone.total_callLogs += 1
				break
			case "event":
				phone.events.push(object)
				phone.total_events += 1
				break
		}
		await phone.save()
		res.status(200).json({ message: `${type} added`, success: true })
	}
	catch (e) {
		console.log(e)
		res.status(500).json({ message: `${type} not added`, success: false })
	}
}


module.exports = router

