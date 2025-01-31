class Config {
    #baseApiUrl = 'https://testapi.lepasa.com';
    getBaseApiUrl() {
        return this.#baseApiUrl;
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
