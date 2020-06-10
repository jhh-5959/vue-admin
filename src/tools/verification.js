//单独引入 Message
import { Message } from 'element-ui';

/**
 * 过滤特殊字符串
 * @param s
 * @returns {string}
 */

export function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~%！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

/**
 *验证邮箱
 * @param val
 * @returns {boolean}
 * @constructor
 */
export function VerifyUserName (val) {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return !reg.test(val)?true:false;
}


/**
 *验证密码
 * @param val
 * @returns {boolean}
 * @constructor
 */
export function VerifyPass (val) {
    let reg = /^(?!\D+$)(?! [^a-zA-Z]+$)\S{6,20}$/;
    return !reg.test(val)?true:false;
}


/**
 *验证验证码
 * @param val
 * @returns {boolean}
 * @constructor
 */
export function VerifyCode (val) {
    let reg = /^[a-z0-9]{6}$/;
    return !reg.test(val)?true:false;
}

/**
 * //判断密码/邮箱是否为空和格式问题
 * @param obj
 * @returns {boolean}
 */
export function isNullorFormat(obj,callback) {
    for (let [key,vla] of Object.entries(obj)){
        if (key==='userName'){
                if (vla==''){
                    Message.error('请输入邮箱/用户名');
                    return
                }else if (VerifyUserName(vla)){
                    Message.error('邮箱/用户名格式有误');
                    return
                }
        }
        if (key==='pass'){
            if (vla==''){
                Message.error('请输入密码');
                return
            }else if (VerifyPass(vla)){
                Message.error('密码格式有误');
                return
            }
        }
    }
    return true;
}

