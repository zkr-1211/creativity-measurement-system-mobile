import {
    AuthException,
    UserException,
    PermissionException,
    SystemException
} from '@/utils/request/exception';

function errorHandler(res) {
    if (!res.status) {
        throw new Error('网络连接失败，请稍后再试');
    }
    switch (res.status) {
        case 401: {
            if (res.data.errcode === 'AUTH_REQUIRE_REALNAME_VERIFY') {
                setTimeout(() => {
                    uni.redirectTo({
                        url: '/pages/login/login'
                    });
                }, 500);
                throw new UserException(
                    res.data.message || '您还未完成身份认证',
                    res.data.errcode
                );
            }
            throw new AuthException('登录过期，请重新登录', res);
        }
        case 400: {
            throw new UserException(
                res.data.message || '发生未知错误，请稍后再试',
                res.data.errcode
            );
        }
        case 403: {
            throw new PermissionException(
                res.data.message || '您没有权限访问该页面',
                res.data.errcode
            );
        }
        case 413: {
            throw new UserException('传输内容超过最大限制', res.data.errcode);
        }
        case 502:
        case 404: {
            throw new SystemException(
                `服务器开小差了，请稍后再试[${res.status}]`,
                res.data.errcode
            );
        }
        default: {
            throw new SystemException(
                '发生未知错误，请稍后再试',
                res.data.errcode
            );
        }
    }
}

export default (axios) => {
    axios.interceptors.response.use(
        async (res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.data.data || {};
            } else {
                errorHandler(res);
            }
        },
        (error) => {
            if (!error.response) {
                throw new Error('网络连接失败，请稍后再试');
            }
            errorHandler(error.response);
        }
    );
};
