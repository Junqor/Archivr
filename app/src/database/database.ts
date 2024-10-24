import {user, media} from "./databaseTypes"

const database = {
    getUserFromEmail: function (email:string){
        if (true){
            let user:user = {email:"grug@grugmail.com", username:"grug", password:"grug123", privilege_level:1};
            return user;
        }
        else{
            return null;
        }
    },
    addUser: function(user:user){
        return true;
    },
    addMedia: function(media:media){
        return true;
    },
}

export {database}