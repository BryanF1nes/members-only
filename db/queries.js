const pool = require("./pool.js");

exports.getMessages = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                messages.id, 
                messages.title, 
                messages.body, 
                messages.timestamp, 
                messages.user_id,
                users.first_name, 
                users.last_name, 
                users.username
            FROM messages
            INNER JOIN users ON messages.user_id = users.id
        `);

        return rows;
    } catch (error) {
        console.error("Unable to grab messages.");
    }
};

exports.getMembers = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM users;");

        return rows;
    } catch (error) {
        console.error("Unable to get members");
    }
}

exports.getMessagesById = async (id) => {
    try {
        const { rows } = await pool.query("SELECT * FROM messages WHERE user_id=$1", [id]);
        return rows;
    } catch (error) {
        console.error("Unable to grab messages");
    }
}