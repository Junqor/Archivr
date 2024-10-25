import {user, media} from "./databaseTypes"

const database = {
    getUserFromEmail: async function (email:string){
        if (email == "skibidi"){
            let user:user = {email:"grug@grugmail.com", username:"grug", password:"grug123", privilege_level:1};
            return user;
        }
        else{
            return null;
        }
    },
    addUser: async function(user:user){
        if (user.email.length > 40 || user.email.length < 0){
            throw new Error("email size bad");
        }
        if (user.username.length > 40 || user.username.length < 0){
            throw new Error("username size bad");
        }
        if (user.password.length > 40 || user.password.length < 0){
            throw new Error("password size bad");
        }
        return true;
    },
    addMedia: async function(media:media){
        return true;
    },
}

export {database}