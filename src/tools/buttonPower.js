import store from '../store/index';

export function buttonPower(power) {
    let btn=store.getters['app/buttonPower'];
    /*console.log(power);
    console.log(btn);*/
    return btn.indexOf(power)>=0;

}