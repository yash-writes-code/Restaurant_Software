import axios from "axios";
import { FormEvent, useState } from "react"

const Category = () => {
    const [name,SetName]= useState<string>('');
    
    const handle_change = (e:React.ChangeEvent<HTMLInputElement>)=>{
        SetName(e.target.value);
    }

    const handle_submit = async(e:FormEvent)=>{
        e.preventDefault();
        //call api
        console.log("name is ",name);
        
        let res = await axios.post("http://localhost:3000/api/categories",{
            name: name,
        });

        if(res.status==200){
            console.log("sucess");
            
        }
        else{
            console.log("fail",res.data);
        }
    }
    return (
    <form action="">
        <input type="text" onChange={handle_change} id="input" placeholder="Enter Category Here"/>
        <button type="submit" onClick={handle_submit}>Create Category</button>
    </form>
  )
}

export default Category