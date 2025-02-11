class Config {
    #baseApiUrl = 'https://testapi.lepasa.com';
    #baseCdnUrl = 'https://lepasa-telegram-app.netlify.app';
    #devInitData = 'user=%7B%22id%22%3A6349140823%2C%22first_name%22%3A%22Rudra%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4IQmXsErxMKTxy4bPce_ZxH3MppjWlnUv2ME030zzx96DNIyi-ZnSyPag7bplMcb.svg%22%7D&chat_instance=-6584738475927264663&chat_type=private&auth_date=1739273021&signature=uN6wasaj4CWbqhOSGusg3c28Iw82XwNONZGwxkrsPqOTMfF-h85vpqGpnnraBMspCC1-11_pj4k4Rm0EliIMCQ&hash=dbf57d637b141eb66e5e09d640a0c26b0965b4bef6313d28e8c9df9ee857f73b';
    getBaseApiUrl() {
        return this.#baseApiUrl;
    }
    getBaseCdnUrl() {
        return this.#baseCdnUrl
    }
    getDevInitData() {
        return this.#devInitData;
    }
    getAtZRanVal() {
        return btoa("ó\u0097\\÷¯\u001eßÎ\u009bç½\u009cw½öyÞ¶}ÍýÓÆ\u009aï\u0086\u009cÛ^4ÙíZå¯yÕÇøyö´ÓvúsÞ5");
    }
    getTelegraAnalyticsInitialization() {
        return {
            'token': 'eyJhcHBfbmFtZSI6IlJ1ZHJhX1RvbkZpZXN0YV9ib3RfdGVzdCIsImFwcF91cmwiOiJodHRwcy8vdC5tZS9SdWRyYV9Ub25GaWVzdGFfYm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vbGVwYXNhLXRlbGVncmFtLWFwcC5uZXRsaWZ5LmFwcCJ9!6XCy6f7P223yHG1DkC1faqn1YJDvXoUSGVxtIcJeTnw=',
            'appName': 'Rudra_TonFiesta_bot_test'
        };
    }
}
