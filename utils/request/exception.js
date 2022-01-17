export class BaseException extends Error {
    constructor(message, errcode) {
        super(message);
        this.errcode = errcode;
    }

    getErrorCode() {
        return this.errcode;
    }
}

export class AuthException extends BaseException {
    constructor(message, errcode) {
        super(message, errcode);
        this.code = 401;
    }
}

export class UserException extends BaseException {
    constructor(message, errcode) {
        super(message, errcode);
        this.code = 400;
    }
}

export class PermissionException extends BaseException {
    constructor(message, errcode) {
        super(message, errcode);
        this.code = 403;
    }
}

export class SystemException extends BaseException {
    constructor(message, errcode) {
        super(message, errcode);
        this.code = 500;
    }
}
