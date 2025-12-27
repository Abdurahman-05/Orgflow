"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_schema_1 = require("./auth.schema");
const auth_service_1 = require("./auth.service");
exports.AuthController = {
    async login(req, res) {
        const { email, password } = auth_schema_1.LoginSchema.parse(req.body);
        const result = await auth_service_1.AuthService.login(email, password, req.ip, req.headers["user-agent"]);
        res.json(result);
    },
    // async refresh(req: Request, res: Response) {
    //   const { refreshToken } = RefreshSchema.parse(req.body);
    //   const result = await AuthService.refresh(refreshToken);
    //   res.json(result);
    // },
    // async activate(req: Request, res: Response) {
    //   const { token, password } = ActivateAccountSchema.parse(req.body);
    //   await AuthService.activateAccount(token, password);
    //   res.json({ message: "Account activated successfully" });
    // }
};
