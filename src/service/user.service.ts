import { User } from "@/types"

export const saveUser = async (user: User) => {
  try {
    const res = await fetch(`https://de-luxe.vercel.app/api/users`,{
      method:"POST",
      headers:{
        'Content-Type': 'application/json',
       
      },
      body: JSON.stringify(user)
    })

    if(!res.ok){
      throw new Error("Failed to save user")
    }

    const data = await res.json();
    console.log("data", data);

    return {
      message: data.message
    }
  } catch (error) {
    
  }
}