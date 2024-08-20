function addBt(){
    const master = document.getElementById("master");
    const div= document.createElement("div");
    const input = document.getElementById("input").value;
    const label = document.createElement("label");
    const delBut = document.createElement("button");
    const editBut = document.createElement("button");
    const chekBox = document.createElement("input");
    const input1 = document.createElement('input');

    input1.className="text-black col-span-9"
    label.className= "col-span-9"

    let editvalue = true    

    chekBox.type = "checkbox";
    chekBox.onchange = () => {if (chekBox.checked===true){
        label.className="line-through text-gray-400 col-span-9"
    }else{
        label.className="col-span-9"
    }};


    label.textContent = input;
    

    editBut.textContent = "EDIT";
    editBut.className = "bg-black";
    editBut.onclick = () => {if (editvalue===true){
        input1.value = label.innerText
        label.replaceWith(input1)
        editBut.textContent = "DONE"
        editBut.className = "bg-green-500";
        editvalue = false
    }else{
        label.textContent = input1.value
        input1.replaceWith(label)
        editvalue = true
        editBut.className = "bg-black";
        editBut.textContent = "EDIT"
    }
    };


    
    delBut.textContent = "DELETE";
    delBut.className = "bg-red-800 ";
    delBut.onclick = () => {delBut.parentElement.remove()};

    div.className = "w-full shadow-xl shadow-xl text-white grid grid-cols-12 rounded-xl p-5";
    
    
    div.appendChild(chekBox);
    div.appendChild(label);
    div.appendChild(editBut);
    div.appendChild(delBut);
    master.appendChild(div);

    
}

