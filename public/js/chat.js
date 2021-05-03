let socket = null;
let socket_admin_id = null;
let email_user = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {

    socket = io();

    const chat_help = document.getElementById('chat_help');
    chat_help.style.display = 'none';

    const chat_in_suport = document.getElementById('chat_in_support');
    chat_in_suport.style.display = 'block';

    const email = document.getElementById('email').value;
    const text = document.getElementById('txt_help').value;

    const params = {
        email,
        text
    };

    email_user = email;

    socket.on('connect', () => {
        socket.emit('client_first_access', params, (call, err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(call);
            }
        })
    });

    socket.on('client_list_all_messages', messages => {
        var template_client = document.getElementById('message-user-template').innerHTML;
        var template_admin = document.getElementById('admin-template').innerHTML;

        messages.forEach(msg => {

            let rendered;

            if (msg.admin_id === null) {
                rendered = Mustache.render(template_client, {
                    message: msg.text,
                    email
                })
            } else {
                 rendered = Mustache.render(template_admin, {
                    message_admin: msg.text,
                })
            }

            document.getElementById('messages').innerHTML += rendered;
        });
    })

    socket.on('admin_send_to_client', params => {
        const { text, socket_id } = params;

        const template_admin = document.getElementById('admin-template').innerHTML;

        const rendered = Mustache.render(template_admin, {
            message_admin: text,
        })

        socket_admin_id = socket_id;
        console.log(socket_admin_id);

        document.getElementById('messages').innerHTML += rendered;

    })
});

document.querySelector('#send_message_button').addEventListener('click', (event) => {
    const text = document.getElementById('message_user').value;
    const params = {
        socket_admin_id,
        text
    }
    socket.emit('client_send_to_admin', params);

    const template_client = document.getElementById('message-user-template').innerHTML;

    const rendered = Mustache.render(template_client, {
        text: text.value,
        email: email_user,
    })

    document.getElementById('messages').innerHTML += rendered;

    text.value = '';

})