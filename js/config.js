class Config {
    #baseApiUrl_Staging = 'https://testapi.lepasa.com';
    #baseApiUrl_Prod = "https://mini.lepasa.com";
    #baseCdnUrl_Staging = 'https://lepasa-telegram-app.netlify.app';
    #baseCdnUrl_Prod = "https://s3.lepasa.com";
    #devInitData_Staging = "user=%7B%22id%22%3A5862694222%2C%22first_name%22%3A%22Akram%22%2C%22last_name%22%3A%22khan%22%2C%22username%22%3A%22Akram11293%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FiwlFr6Ow8vapKJKn6Ek933dUk_iNto04D41gsrJGdTrmIFB6y0hatxgsam4kMviS.svg%22%7D&chat_instance=5363015193428653530&chat_type=sender&auth_date=1739530639&signature=bYW0ozu6k1IBUEAt_cfiSAJtqqQqmhU8TUoO_ZHrMROVupmU6IcbkORiiqxzMLLQF08Ee8RYQ4IHIbV6EOikBA&hash=af193df8f840b61b2e6a4618371b5fa0eb8d47bc892f290af30e0ff572305962";
    #devInitData_Prod = "user=%7B%22id%22%3A5862694222%2C%22first_name%22%3A%22Akram%22%2C%22last_name%22%3A%22khan%22%2C%22username%22%3A%22Akram11293%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FiwlFr6Ow8vapKJKn6Ek933dUk_iNto04D41gsrJGdTrmIFB6y0hatxgsam4kMviS.svg%22%7D&chat_instance=5363015193428653530&chat_type=sender&auth_date=1739530639&signature=bYW0ozu6k1IBUEAt_cfiSAJtqqQqmhU8TUoO_ZHrMROVupmU6IcbkORiiqxzMLLQF08Ee8RYQ4IHIbV6EOikBA&hash=af193df8f840b61b2e6a4618371b5fa0eb8d47bc892f290af30e0ff572305962";
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
