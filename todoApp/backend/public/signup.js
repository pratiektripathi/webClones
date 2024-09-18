const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmpassword = document.getElementById("confirmpassword")
const signup = document.getElementById("signup")



if(!username.value || !email.value  || !password.value || !confirmpassword.value){
    signup.disabled = true;
    signup.className="bg-sky-600 w-1/3 rounded-xl font-bold py-2 my-2 hover:bg-sky-800 disabled:bg-gray-300 disabled:text-white"

} 

const checknull =()=>{
    if(!username.value || !email.value || !password.value || !confirmpassword.value){
        signup.disabled = true;
        signup.className="bg-sky-600 w-1/3 rounded-xl font-bold py-2 my-2 hover:bg-sky-800 disabled:bg-gray-300 disabled:text-white"
    
    } else{
        signup.disabled = false;
        signup.className="bg-sky-600 w-1/3 rounded-xl font-bold py-2 my-2 hover:bg-sky-800"
    

    }

}


const handleClick =() =>{
    console.log("hello")
}