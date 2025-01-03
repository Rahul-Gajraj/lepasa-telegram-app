class Controller {
    #initData = 'user=%7B%22id%22%3A6349140823%2C%22first_name%22%3A%22Rudra%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4IQmXsErxMKTxy4bPce_ZxH3MppjWlnUv2ME030zzx96DNIyi-ZnSyPag7bplMcb.svg%22%7D&chat_instance=-6584738475927264663&chat_type=private&auth_date=1735579233&signature=xJubsgO_1N15GlOK4cz6L7s53eJYdo39mahLmor8ctGmoNRJdHrB9Uyx4XyVsz2PgESLSMUMvi8Rn6zzvEw6AA&hash=fb323c60e538e4682559f1e95762e1e1f7857edd7f68cdd224edc8034b1a7b01';
    #baseApiUrl = null;
    #userInfoData = null;
    constructor() {
        this.#baseApiUrl = (new Config()).getBaseApiUrl();
    }

    getLandingPageInfo(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/get-info',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                initData: that.#initData,
                referralCode: null,
                timeDifference: '+05:30',
                timezone: 'Asia/Calcutta'
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData = returnData.data;
                    // var tempData = that.#userInfoData;
                    // tempData.isFreshUser = 1;
                    // successCallback(tempData);
                    // return;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else alert("Something went wrong. Please try again later.");
            },
            error: function () { alert("Something went wrong. Please try again later."); }
        });
    }
    updateWelcomeClaim(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/fresh-user-claimed',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else alert("Something went wrong. Please try again later.");
            },
            error: function () { alert("Something went wrong. Please try again later."); }
        });
    }
    getUserInfoData(){
        return this.#userInfoData;
    }
}