"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../src/env");
const BASE_URL = `http://127.0.0.1:${env_1.env.PORT}/api/auth`;
async function verifyAuth() {
    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';
    console.log('1. Registering user...');
    try {
        const registerRes = await axios_1.default.post(`${BASE_URL}/register`, {
            email,
            password,
            name,
        });
        console.log('   Success! User ID:', registerRes.data.id);
    }
    catch (error) {
        console.error('   Failed:', error.response?.data || error.message);
        process.exit(1);
    }
    console.log('2. Logging in...');
    let accessToken = '';
    let refreshToken = '';
    try {
        const loginRes = await axios_1.default.post(`${BASE_URL}/login`, {
            email,
            password,
        });
        accessToken = loginRes.data.accessToken;
        refreshToken = loginRes.data.refreshToken;
        console.log('   Success! Got tokens.');
    }
    catch (error) {
        console.error('   Failed:', error.response?.data || error.message);
        process.exit(1);
    }
    console.log('3. Refreshing token...');
    try {
        const refreshRes = await axios_1.default.post(`${BASE_URL}/refresh`, {
            refreshToken,
        });
        if (refreshRes.data.accessToken) {
            console.log('   Success! Got new access token.');
        }
        else {
            throw new Error('No access token returned');
        }
    }
    catch (error) {
        console.error('   Failed:', error.response?.data || error.message);
        process.exit(1);
    }
    console.log('Verification Complete!');
}
verifyAuth();
