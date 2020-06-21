$(document).ready(function(){
    $('#next_image').on('click',nextImageClickHandler);
    $('#prev_image').on('click',prevImageClickHandler);
});

function nextImageClickHandler(){
    var current = parseInt($('#image_head').attr("data-current"));
    if (current ==  6){
        current = 1;
    }
    else{
        current += 1;
    }

    $('#image_head').attr("data-current",current);
    $('#image_head').attr("src","/"+current+".png");
}

function prevImageClickHandler(){
    var current = parseInt($('#image_head').attr("data-current"));
    if (current ==  1){
        current = 6;
    }
    else{
        current -= 1;
    }

    $('#image_head').attr("data-current",current);
    $('#image_head').attr("src","/"+current+".png");
}