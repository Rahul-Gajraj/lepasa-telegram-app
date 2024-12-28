class Navigator
{

    constructor(){
        
    }
    init(){
        this.landingPage();
    }
    hideAll(){
        $(".loading_screen").addClass('hide');
        $(".welcome_screen").addClass('hide');
        $(".welcome_bonus_wrapper").addClass('hide');
        $(".login_verification").addClass('hide');
        $(".play_container").addClass('hide');
        $(".earn_container").addClass('hide');
        $(".earn_detail_container").addClass('hide');
        $(".ref_container").addClass('hide');
        $(".shop_container").addClass('hide');
        $(".leagues_container").addClass('hide');
        $(".more_container").addClass('hide');
        $(".footer").addClass('hide');
    }
    landingPage(){
        console.log('On landing page');
        var that=this;
        setTimeout(function(){
            that.gotoWelcomePage();
        },300);
    }

    gotoWelcomePage(){
       $(".loading_screen").addClass('hide');
       $(".welcome_screen").removeClass('hide');
       var that=this;
       setTimeout(function(){
        that.gotoPlayPage();
    },300);
    }

    gotoPlayPage(){
        this.hideAll();
        $(".play_container").removeClass('hide');
        $(".footer").removeClass('hide');
    }
}

$(document).ready(function(){
    var navigator=new Navigator();
    navigator.init();    
});

