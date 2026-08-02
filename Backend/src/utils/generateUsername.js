import { Users } from "../models/users.model";

export const generateUsername = async (email) => {
    let baseUsername = email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 15);
    
    let username = baseUsername;
    let counter = 1;
    
    // Check if username already exists in database
    while (await Users.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
    }
    
    return username;
}