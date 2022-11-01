// 判断当前移动端是安卓还是IOS
function mobileType() {
    let type = '';
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
        type = 'IOS';
    } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
        type = 'Android';
    }
    return type;
}
