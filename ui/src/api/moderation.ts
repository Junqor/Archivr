import { getAuthHeader } from "@/utils/authHeader";



export async function is_user_banned(user_id:number){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/is-user-banned",{
        method: "POST",
        body: JSON.stringify({user_id: user_id}),
    });

    if (!response.ok) {
        throw new Error("Nuh uh");
    }

    return response;
}

export async function get_user_offences(user_id:number){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/get-user-offences/"+user_id.toString(),{
        method: "GET",
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        throw new Error("Nuh uh");
    }

    return response;
}

export async function ban_users(user_ids:Array<number>, expiry_timestamp:string|null, message:string){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/ban-users",{
        method: "POST",
        headers: {...getAuthHeader(),
            "content-type": "application/json"
        },
        body: JSON.stringify({user_ids, expiry_timestamp, message}),
    });

    if (!response.ok) {
        throw new Error("Nuh uh");
    }
}

export async function pardon_users(user_ids:Array<number>){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/pardon-users",{
        method: "POST",
        headers: {...getAuthHeader(),
            "content-type": "application/json"
        },
        body: JSON.stringify({user_ids:user_ids}),
    });

    if (!response.ok) {
        throw new Error("Nuh uh");
    }
}