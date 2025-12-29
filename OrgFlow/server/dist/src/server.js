"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./env");
const app = (0, app_1.createApp)();
const port = parseInt(env_1.env.PORT);
console.log('DATABASE_URL exists:', !!env_1.env.DATABASE_URL);
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
exports.default = app;
