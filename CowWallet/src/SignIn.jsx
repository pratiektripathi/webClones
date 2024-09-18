import React, { useState } from 'react';
import cowImage from './assets/cow.png'; 
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Buffer } from 'buffer';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";


export function SignInOne({prop}){
  return (
    <>
    <div className='w-full flex justify-center'>
    <h1 className='text-4xl font-bold text-gray-800'>Let's get started</h1>
    </div>
    <div className='w-full flex justify-center'>
      <img src={cowImage} className='w-40 py-5'/>
    </div>
    <div className='w-full flex justify-center'>
      <button className='bg-black text-white sm:w-1/2 w-full py-3 my-2 rounded-3xl' onClick={prop}>Create a new wallet</button>
    </div>
    <div className='w-full flex justify-center'>
      <button className='border-2 border-black sm:w-1/2 w-full py-2 my-2 rounded-3xl'>Import an existing wallet</button>
    </div>
    </>
  );
}

export function SignInTwo({prop}){
  const [toggle,settoggle] = useState("show")
  const [butdisable,setbutdisable] = useState(true)
  
  const changePass = () => settoggle((old) => old==="show" ? "hide" : "show");
  const [pass,setpass] = useState(
    {
      password: "",
      confirmpassword:""
    }
  )

  const checkpass = (e) => {
    const {name,value}=e.target;
    
    setpass((pre)=>({...pre,[name]:value}));

    name === pass.password ? setbutdisable(value!= pass.confirmpassword) : setbutdisable(value!=pass.password)
    
    }
  


  return (
    <>
    <form>
      <div className='w-full flex justify-center'>
        <h1 className='text-2xl font-bold '>Create password</h1>
      </div>
      <div className='w-full flex justify-center'>
        <h2 className='sm:w-2/3 text-center py-4'>This password will unlock your C🪙w wallet only on this device. C🪙w can not recover this password.</h2>
      </div>
      <div className='w-full flex justify-center'>
        <div className='w-full sm:w-1/2 flex justify-end'>
        <button className='text-sky-900 underline' type='button' onClick={changePass}>{toggle}</button>
        </div>
      </div>
      <div className='w-full flex justify-center py-2' >
        <input className='w-full sm:w-1/2 px-2 py-2' onChange={checkpass}  type={toggle==="show" ? "password" : "text"} name='password' placeholder='Password'/>
      </div>
      <div className='w-full flex justify-center py-2'>
        <input className='w-full sm:w-1/2 px-2 py-2' onChange={checkpass} type={toggle==="show" ? "password" : "text"} name='confirmpassword' placeholder='Confirm Password'/>
      </div>
      <div className='w-full flex justify-center py-4'>
        <button className='w-full sm:w-1/2 bg-black rounded-3xl text-white py-3 disabled:bg-gray-300' disabled={butdisable} type='button' onClick={prop}>Create wallet 🚀</button>
      </div>

    </form>
    </>
  );
}

export function SignInThree(){

  const mnemonic = generateMnemonic();

  const [arrs,setarrs]= useState(mnemonic.split(" ") ||[])
  
  const [concern,setconcern] = useState(true)

  const [seed,setseed] =useState("")

  const generate = () =>{
    const mnemonic = generateMnemonic();
    setarrs(mnemonic.split(" "))
  }

  const createwallet = () =>{
    setseed(mnemonicToSeedSync(arrs.join(" ")))
  }

  const checkckeckbox=(e)=>{
      setconcern(!e.target.checked)
    }
 

return (
  <>
  <div className='w-full flex justify-center'>
    <h1 className='text-2xl text-center font-bold'>Write down your Secret Recovery Phrase</h1>
  </div>
  <div className='w-full flex justify-center'>
    <h2 className='text-center'>Write down this 12-word Secret Recovery Phrase and save it in a place that you trust and only you can access.</h2>
  </div>
  <div className='flex justify-end'>
    <button className='text-sky-900 underline' type='button' onClick={generate}>re-generate</button>
  </div>
  <div className='grid grid-cols-4 my-2 backdrop-opacity-10 backdrop-invert bg-white/50 rounded-2xl border-2 border-white'>
    {arrs.map((arr,index)=>{
      return (
        <div  className='py-2 flex justify-center' key={index}>
          <h1>{index+1}. {arr}</h1>
        </div>
      )
    })}
  </div>
  <div className='w-full flex justify-center'>
      <input type="checkbox" onChange={checkckeckbox}/> 
      <label htmlFor="checkbox" className='pb-1 px-2'>I save my secret recovery Phrase</label>
  </div>
  <div className='flex justify-center py-4'>
    <button className='w-full sm:w-1/3 bg-black text-white px-10 py-2 rounded-3xl disabled:bg-gray-300' disabled={concern} type="button" onClick={createwallet}>Create wallet </button>
  </div>
  <div>
    <h1>{seed}</h1>
  </div>


  </>
);
}






export function SignInFour() {
  const [pageNo,setpageNo] = useState(1) ;
  

  const click = () => {
    setpageNo((pre)=>pre+1)  
  }

 
  return (
    <section className="w-full h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 to-pink-500 p-0">
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="sm:w-1/2 w-full">
          <div className="mb-2 items-center justify-center backdrop-opacity-10 backdrop-invert bg-white/30 rounded-xl outline outline-2 outline-white p-5">
          {pageNo===1 && <SignInOne prop={click}/>}
          {pageNo===2 && <SignInTwo prop={click}/>}
          {pageNo===3 && <SignInThree/>}
          </div>
        </div>
      </div>
    </section>
  );
}
