import Vue from 'vue';

export default (axios) => {
    axios.interceptors.request.use(
        (config) => {
            const token = uni.getStorageSync('token');
            const appSource = Vue.prototype.request_type;
            const appVersion = Vue.prototype.version;
            if (appSource) {
                config.headers['app-source'] = appSource;
            }
            if (appVersion) {
                config.headers['app-version'] = appVersion;
            }
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            console.log(`请求出现错误: ${error}`);
            throw error;
        }
    );
};
