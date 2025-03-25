import { getAuthHeader } from "@/utils/authHeader";

export type TUserBanData = {
  is_banned: boolean | undefined;
  expiry_date: string | undefined;
  message: string | undefined;
}

export async function is_user_banned(user_id:number){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/is-user-banned/"+user_id.toString(),{
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("A problem occurred: bad response");
    }

    const response_decode = await response.json();
    return response_decode as TUserBanData;
}

export async function get_user_offences(user_id:number,limit:number,offset:number){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/get-user-offences/"+user_id.toString(),{
        method: "POST",
        headers: {...getAuthHeader(),
            "content-type": "application/json"
        },
        body: JSON.stringify({limit:limit,offset:offset})
    });

    if (!response.ok) {
        throw new Error("A problem occurred: bad response");
    }

    return response.json();
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
        throw new Error("A problem occurred: bad response");
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
        throw new Error("A problem occurred: bad response");
    }
}

export async function pardon_action(id: number){
    const response = await fetch(import.meta.env.VITE_API_URL+"/moderation/pardon-action",{
        method: "POST",
        headers: {...getAuthHeader(),
            "content-type": "application/json"
        },
        body: JSON.stringify({id:id}),
    });

    if (!response.ok) {
        throw new Error("A problem occurred: bad response");
    }
}