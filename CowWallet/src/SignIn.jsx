import React, { useState } from 'react';
import cowImage from './assets/cow.png'; 
import { generateMnemonic } from 'bip39';



export function SignInFour() {
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkPass,setCheckPass] = useState('')


  const toggleShowHide = () => {
    setIsShown(!isShown);
  };

  const handleCreateWallet = () => {
    setIsCreatingWallet(true);
  };


  const matchPass = (e) =>{

    setConfirmPassword(e)
    if (password===e){
      setCheckPass("")
    }else (setCheckPass("Passwords don't match"))
    
  }



  const savePass =() =>{
    if (password===confirmPassword){
      setCheckPass("")
      localStorage.setItem("cowWalletPass",confirmPassword)

    }else (setCheckPass("Passwords don't match"))
    

  };

  return (
    <section className="w-full h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 to-pink-500 p-0">
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="sm:w-1/2 w-full">
          <div className="mb-2 items-center justify-center backdrop-opacity-10 backdrop-invert bg-white/30 rounded-xl outline outline-2 outline-white p-5">
            <div className="flex justify-center pt-5 pb-5">
              <h1 className="text-3xl font-bold font-sans text-black">
                {isCreatingWallet ? 'Create Password' : "Let's Get Started"}
              </h1>
            </div>
            <div className="flex justify-center">
              {isCreatingWallet ? (
                <p className="text-l font-sans text-center">
                  This password will unlock your C🪙w Wallet only in this device.
                  <br />
                  We don't save your private keys.
                </p>
              ) : (
                <img className="h-48" src={cowImage} alt="cow" />
              )}
            </div>
            <div className="p-10">
              {isCreatingWallet ? (
                <form>
                  <div className="flex justify-end p-2 w-3/4">
                    <button
                      type="button"
                      onClick={toggleShowHide}
                      className="text-sm text-fuchsia-800 underline decoration-2"
                    >
                      {isShown ? 'Hide' : 'Show'} Password
                    </button>
                  </div>
                  <div className="flex justify-center p-2">
                    <input
                      type={isShown ? 'text' : 'password'}
                      className="w-1/2 rounded h-10 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      
                    />
                  </div>
                  <div className="flex justify-center p-2">
                    <input
                      type={isShown ? 'text' : 'password'}
                      className="w-1/2 rounded h-10 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => matchPass(e.target.value)}
                      
                    />
                  </div>
                  <div className="flex justify-end p-2 w-3/4 font-xs text-rose-500">
                    <p>
                      {checkPass}
                    </p>
                  </div>

                  <div className="flex justify-center p-2 py-5">
                    <button
                      type='button'
                      className="bg-black text-white font-sans w-1/2 rounded-3xl h-12 text-sm"
                      onClick={savePass}
                    >
                      Create a new Wallet 🚀
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-center pt-2 pb-2 font-sans">
                    <button
                      onClick={handleCreateWallet}
                      className="bg-black text-white font-semibold py-2 px-4 rounded-3xl text-sm w-2/3 h-12"
                    >
                      Create a new wallet
                    </button>
                  </div>
                  <div className="flex justify-center pt-2 pb-2 font-sans">
                    <button className="bg-white outline text-black font-semibold py-1 px-2 rounded-3xl text-sm w-2/3 h-10">
                      Import an existing wallet
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
