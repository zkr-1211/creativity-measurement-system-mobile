import {
    AuthException,
    PermissionException,
    SystemException,
    UserException
} from '@/utils/request/exception';

import Auth from '@/utils/Auth';
import RequestInterceptors from './interceptors/request';
import ResponseInterceptors from './interceptors/response';
import Tools from '@/utils/Tools';
import axios from 'axios';
import config from '@/config';

const instance = axios.create({
    baseURL: config.api.systemURL,
    timeout: 8000
});

RequestInterceptors(instance);
ResponseInterceptors(instance);

async function request(options) {
    try {
        return await instance(options);
    } catch (error) {
        let retrySuccess = false;
        let res;
        let errInstances = error;
        if (error instanceof AuthException) {
            if (!options._try_count && options._try_count !== 0) {
                options._try_count = 1;
            }
            if (options._try_count > 0) {
                try {
                    await Tools.removeStorage('token');
                    await Auth.login();
                    console.log(`剩余${options._try_count}次重试机会`);
                    options._try_count--;
                    res = await request(options);
                    retrySuccess = true;
                } catch (err) {
                    errInstances = err;
                    if (options._redirect_login !== false) {
                        uni.redirectTo({
                            url: '/pages/login/login'
                        });
                    }
                }
            } else {
                if (options._redirect_login !== false) {
                    uni.redirectTo({
                        url: '/pages/login/login'
                    });
                }
            }
        }
        if (retrySuccess) {
            return res;
        }
        throw errInstances;
    }
}

export default request;
