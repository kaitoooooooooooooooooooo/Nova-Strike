let fruits=["pomme","poire","orange","banane","cerise"];

console.log(fruits);
fruits=arraydelete(fruits,"cerise");
console.log(fruits);



function arraydelete(array,item){
    const i = array.indexOf(item);
    if(i==-1)
        return;
    const newArray=array.slice(0,i).concat(array.slice(i+1,array.length));
    return newArray;
}