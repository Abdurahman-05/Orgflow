"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
exports.healthController = {
    check: (req, res) => {
        res.json({ status: "ok", uptime: process.uptime() });
    }
};
