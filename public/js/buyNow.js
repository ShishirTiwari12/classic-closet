const buyNow = document.querySelectorAll('.buy-now');
const product = document.querySelector('.product');
const id = product.id;
for(let x of buyNow){
    x.addEventListener('click',esewa);
}


async  function esewa(e){
    let productIds=[product.id];
    // console.log('button is clicked');
    // console.log(id);
    // console.log(product);


    try{
    const response = await fetch(`/payment`,{
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({productIds:productIds})
    });
    if(response.redirected){
        window.location.href = response.url;
        return;
    }
    const data = await response.text();
    document.body.innerHTML= data;
    }
    catch(err){
        console.log(err);
    }

}

