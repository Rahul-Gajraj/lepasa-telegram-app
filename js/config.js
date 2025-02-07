class Config {
    #baseApiUrl = 'https://testapi.lepasa.com';
    #baseCdnUrl = 'https://lepasa-telegram-app.netlify.app';
    #devInitData = 'user=%7B%22id%22%3A6349140823%2C%22first_name%22%3A%22Rudra%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4IQmXsErxMKTxy4bPce_ZxH3MppjWlnUv2ME030zzx96DNIyi-ZnSyPag7bplMcb.svg%22%7D&chat_instance=3286239363269177920&chat_type=sender&auth_date=1738561988&signature=gbwU9Bg_GoNcvV4dNoH7Yq9Xu1nSZ6kgOh09u9E2bdBlEls_s5wAQlzmsRWRWVpy6AZa9zpgHHLjrifRceOnBg&hash=bf10feafe9493dec967cfc754705cb87800cd1262bba6698a222308452bcab9c';
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
