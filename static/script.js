let ele_nav = document.getElementsByClassName("drop-down");

let ele_nava=Array.from(ele_nav);
ele_nava.forEach((value,index)=>{
   let ele =  ele_nav[index];
   ele.addEventListener('mouseover',()=>{
    ele.childNodes[1].style.display='block';
   })
   ele.addEventListener('mouseout',()=>{
    ele.childNodes[1].style.display='none';
   })
   
}

);

let elehome = document.getElementById("home");
setInterval(()=>{
elehome.classList.toggle("bg6");
elehome.classList.toggle("bg7");
},4000)

