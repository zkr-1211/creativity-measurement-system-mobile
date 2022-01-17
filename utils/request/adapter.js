import axios from 'axios';

axios.defaults.adapter = function (config) {
    return new Promise((resolve, reject) => {
        var settle = require('axios/lib/core/settle');
        var buildURL = require('axios/lib/helpers/buildURL');
        const contentType = config.headers['Content-Type'];
        if (contentType && contentType.indexOf('multipart/form-data') != -1) {
            uni.uploadFile({
                url:
                    config.baseURL +
                    buildURL(
                        config.url,
                        config.params,
                        config.paramsSerializer
                    ),
                header: config.headers,
                filePath: config.filePath,
                name: config.name,
                formData: config.data,
                timeout: config.timeout || 60000,
                complete: function complete(response) {
                    response = {
                        data: response.data,
                        status: response.statusCode,
                        errMsg: response.errMsg,
                        header: response.header,
                        config: config
                    };
                    settle(resolve, reject, response);
                }
            });
        } else {
            uni.request({
                method: config.method.toUpperCase(),
                url:
                    config.baseURL +
                    buildURL(
                        config.url,
                        config.params,
                        config.paramsSerializer
                    ),
                header: config.headers,
                data: config.data,
                dataType: config.dataType,
                responseType: config.responseType,
                sslVerify: config.sslVerify,
                timeout: config.timeout || 60000,
                complete: function complete(response) {
                    response = {
                        data: response.data,
                        status: response.statusCode,
                        errMsg: response.errMsg,
                        header: response.header,
                        config: config
                    };
                    settle(resolve, reject, response);
                }
            });
        }
    });
};
