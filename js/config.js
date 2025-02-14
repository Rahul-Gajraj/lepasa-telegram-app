class Config {
    #baseApiUrl_Staging = 'https://testapi.lepasa.com';
    #baseApiUrl_Prod = "https://mini.lepasa.com";
    #baseCdnUrl_Staging = 'https://lepasa-telegram-app.netlify.app';
    #baseCdnUrl_Prod = "https://s3.lepasa.com";
    #devInitData_Staging = 'user=%7B%22id%22%3A6349140823%2C%22first_name%22%3A%22Rudra%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4IQmXsErxMKTxy4bPce_ZxH3MppjWlnUv2ME030zzx96DNIyi-ZnSyPag7bplMcb.svg%22%7D&chat_instance=-6584738475927264663&chat_type=private&auth_date=1739273021&signature=uN6wasaj4CWbqhOSGusg3c28Iw82XwNONZGwxkrsPqOTMfF-h85vpqGpnnraBMspCC1-11_pj4k4Rm0EliIMCQ&hash=dbf57d637b141eb66e5e09d640a0c26b0965b4bef6313d28e8c9df9ee857f73b';
    #devInitData_Prod = 'user=%7B%22id%22%3A6349140823%2C%22first_name%22%3A%22Rudra%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4IQmXsErxMKTxy4bPce_ZxH3MppjWlnUv2ME030zzx96DNIyi-ZnSyPag7bplMcb.svg%22%7D&chat_instance=-6584738475927264663&chat_type=private&auth_date=1739273021&signature=uN6wasaj4CWbqhOSGusg3c28Iw82XwNONZGwxkrsPqOTMfF-h85vpqGpnnraBMspCC1-11_pj4k4Rm0EliIMCQ&hash=dbf57d637b141eb66e5e09d640a0c26b0965b4bef6313d28e8c9df9ee857f73b';
    getBaseApiUrl() {
        if (this.#isProd())
            return this.#baseApiUrl_Prod;
        else
            return this.#baseApiUrl_Staging;
    }
    getBaseCdnUrl() {
        if (this.#isProd())
            return this.#baseCdnUrl_Prod
        else
            return this.#baseCdnUrl_Staging;
    }
    getDevInitData() {
        if (this.#isProd())
            return this.#devInitData_Prod;
        else
            return this.#devInitData_Staging;
    }
    getAtZRanVal() {
        if (this.#isProd())
            return btoa(
                "ó\u0097\\÷¯\u001eßÎ\u009bç½\u009cw½öyÞ¶}ÍýÓÆ\u009aï\u0086\u009cÛ^4ÙíZå¯yÕÇøyö´ÓvúsÞ5"
            );
        else
            return btoa("ó\u0097\\÷¯\u001eßÎ\u009bç½\u009cw½öyÞ¶}ÍýÓÆ\u009aï\u0086\u009cÛ^4ÙíZå¯yÕÇøyö´ÓvúsÞ5");
    }
    getTelegraAnalyticsInitialization() {
        if (this.#isProd())
            return {
                token:
                    "eyJhcHBfbmFtZSI6IkxlcGFzYVRvbkZpZXN0YSIsImFwcF91cmwiOiJodHRwczovL3QubWUvTGVwYXNhVG9uRmllc3RhX2JvdC9zdGFydCIsImFwcF9kb21haW4iOiJodHRwczovL3MzLmxlcGFzYS5jb20ifQ==!lvENwRk58mZMOB54XFvI40s4gH/8pyPvyCufeiF8G+k=",
                appName: "TonFiesta",
            };
        else
            return {
                'token': 'eyJhcHBfbmFtZSI6IlJ1ZHJhX1RvbkZpZXN0YV9ib3RfdGVzdCIsImFwcF91cmwiOiJodHRwcy8vdC5tZS9SdWRyYV9Ub25GaWVzdGFfYm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vbGVwYXNhLXRlbGVncmFtLWFwcC5uZXRsaWZ5LmFwcCJ9!6XCy6f7P223yHG1DkC1faqn1YJDvXoUSGVxtIcJeTnw=',
                'appName': 'Rudra_TonFiesta_bot_test'
            };
    }
    #isProd() {
        return window.location.hostname === 's3.lepasa.com';
    }
}
