const messagesDiv = document.querySelector('#messageDiv');

async function getMessages() {
    const url = 'http://localhost:3000/messages';
    // const url = 'https://members-only-fq74.onrender.com/messages';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        };

        const data = await response.json();

        createMessage(data, messagesDiv);

    } catch (error) {
        
    }
}

getMessages();



function createMessage(msg, parent) {
    msg.forEach(message => {
        const div = document.createElement("div");
        div.classList.add("flex", "my-4", "py-4")
        div.id = message.id;

        const initial = message.first_name[0].toUpperCase() + '' + message.last_name[0].toUpperCase();
        const date = new Date(message.timestamp);
        const formattedTimeStamp = date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }) + ' @ ' + date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
        
        div.innerHTML = `
            <div class="mr-4 shrink-0 self-start">
                <span class="inline-flex size-14 items-center justify-center rounded-full bg-gray-500">
                    <span class="text-xl font-medium text-white">${initial}</span>
                </span>
            </div>
            <div class="w-full">
                <h4 class="text-lg font-bold">${message.title}</h4>
                <pre class="mt-1 leading-tight text-md text-gray-900 whitespace-pre-wrap">${message.body}</pre>
                <p id="timestamp" class="mt-1 text-right text-sm text-gray-900">${formattedTimeStamp}</p>
            </div>
        `

        parent.append(div);
    })
}
