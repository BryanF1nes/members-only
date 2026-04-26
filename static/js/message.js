const messagesDiv = document.querySelector('#messageDiv');

async function getMessages() {
    // const url = 'http://localhost:3000/messages';
    const url = 'https://members-only-fq74.onrender.com/messages';
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
        div.classList.add("flex", "my-4", "py-4");
        div.id = message.id;

        const initial = message.first_name[0].toUpperCase() + message.last_name[0].toUpperCase();

        const date = new Date(message.timestamp);
        const formattedTimeStamp =
            date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }) +
            ' @ ' +
            date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "mr-4 shrink-0 self-start";

        const avatar = document.createElement("span");
        avatar.className = "inline-flex size-14 items-center justify-center rounded-full bg-gray-500";

        const avatarText = document.createElement("span");
        avatarText.className = "text-xl font-medium text-white";
        avatarText.textContent = initial;

        avatar.appendChild(avatarText);
        avatarWrapper.appendChild(avatar);

        const content = document.createElement("div");
        content.className = "w-full";

        const title = document.createElement("h4");
        title.className = "text-lg font-bold";
        title.textContent = message.title; // ✅ SAFE

        const body = document.createElement("pre");
        body.className = "mt-1 leading-tight text-md text-gray-900 whitespace-pre-wrap";
        body.textContent = message.body; // ✅ SAFE

        const timestamp = document.createElement("p");
        timestamp.className = "mt-1 text-right text-sm text-gray-900";
        timestamp.textContent = formattedTimeStamp;

        content.appendChild(title);
        content.appendChild(body);
        content.appendChild(timestamp);

        div.appendChild(avatarWrapper);
        div.appendChild(content);

        parent.append(div);
    });
}
