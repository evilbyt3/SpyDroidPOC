// THIS IS THE BROWSER CLIENT
// TASKS:
//      -- Get the command and forward it to the phone
//      -- Retrieve feedback from phone and show it


// Send to the server a post request with the cmd

const socket = io()
const commandForm  = document.getElementById('send-container')
const commandInput = document.getElementById('cmd-input')

socket.on('b_msg', msg => {
    console.log(msg)
})

commandForm.addEventListener('submit', e => {
    e.preventDefault()
    const cmd = commandInput.value
    socket.emit('b_cmd', cmd)
    cmd.value = ''
})