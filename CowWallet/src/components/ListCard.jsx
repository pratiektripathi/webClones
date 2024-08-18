import React from "react"


export function ListCard(number=1,text="hello"){

    return (
        <div className="font-black w-1/14 bg-black flex">
            <div>
                <p>{number}</p>
            </div>
            <div>
                <p>{text}</p>
            </div>


        </div>



    )
}