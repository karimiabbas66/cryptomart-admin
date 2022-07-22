export class JwtRequest {
    username: string;
    password: string;
    ipAddress: string;
    realm:string
    captchaClaim:string;
    captchaAnswer:string;
}
