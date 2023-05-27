const removeItemInCart = (id) => {
    location.href = '/deleteItemInCart/' + id;
}

const total = document.getElementById('total');
const quantity = document.getElementsByName('quantity');
const price = document.getElementsByName('price');

const tangQuantity = (gia,index) => {
    quantity[index].stepUp()
    tinhTien(gia,index)
}

const giamQuantity = (gia,index) => {
    quantity[index].stepDown()
    tinhTien(gia,index)
}

const tinhTien = (gia,index) => {
    var tinh = Number(quantity[index].value) * gia;
    price[index].innerHTML = tinh + 'đ';
    // var tong = 0;
    // for (let i = 0; index < price.length; i++) {
    //     alert(price[i].value)
    //     // tong += Number(price[i].value.toString().substring(0, price[i].value.length-1));
    // }
    // total.innerHTML = tong.toString() + 'đ';
}
