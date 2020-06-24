import cookie from "cookie_js";

const adminToken='adminToken';
const adminName='adminName';

export function getTaken() {
    return cookie.get(adminToken)
}
export function setTaken(value) {
     cookie.set(adminToken,value)
}

export function clearTaken() {
    cookie.remove(adminToken)
}

export function getUserName() {
    return cookie.get(adminName);
}

export function setUserName(value) {
     cookie.set(adminName,value);
}
export function clearUserName() {
    cookie.remove(adminName)
}