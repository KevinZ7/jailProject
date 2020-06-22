$(document).ready(function(){
    $('#next_image').on('click',nextImageClickHandler);
    $('#prev_image').on('click',prevImageClickHandler);
    $('#submit_new').on('click',submitNewHandler);
    $('#add_button').on('click',addButtonHandler);
    $('#cancel_new').on('click',cancelButtonHandler);
    $('#cancel_edit').on('click',cancelEditHandler);
    $('#list_button').on('click',listButtonHander);
    $('.close').on('click',closeButtonHandler);
    $('#criminal_list_container').on('click','.edit_button',editButtonHandler);
    $('#save_edit').on('click',saveEditHandler);
    $('#criminal_list_container').on('click','.delete_button',deleteButtonHandler);
    $('#item_container').on('click','.criminal_image',crimimageclick);
    $('#close_detail').on('click',closeDetail);
    

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

function submitNewHandler(){
    var data ={
        name: $('#new_name').val(),
        size: $('#new_size ').val(),
        height: $('#new_height').val(),
        sin: $('#new_sin').val(),
        type: $('#crime_type').children("option:selected").val(),
        image: $('#image_head').attr("data-current")
    }

    if(data.sin.length != 6 || data.name =='' || data.name ==undefined || data.size == undefined || data.height == undefined || data.size < 0 || data.size > 300 || data.height < 0 || data.height > 300){
        alert("Please enter all boxes and follow the rules!");
        return;
    }
    

    $.ajax({
        method: 'POST',
        url: '/addcriminal',
        data: data,
        success: function(res){
            if(res == "error"){
                alert("A person with the SIN is already in jail!");
            }else{
                $('#add_modal').css("display","none");
            }
        }
    })
}


function addButtonHandler(){
    $('#add_modal').css("display","flex");
    $('#new_name').val('');
    $('#new_size').val('');
    $('#new_height').val('');
    $('#new_sin').val('');
    $('#image_head').attr("data-current",1);
    $('#image_head').attr("src","/1.png");
    
}

function cancelButtonHandler(){
    $('#add_modal').css("display","none");
}

function listButtonHander(){
    $('#criminal_list_container').empty();
    $('#list_modal').css("display","flex");
    $.ajax({
        method: 'GET',
        url: '/listcriminal',
        success: function(data){
            $('#criminal_list_container').append('Count: ' + data.rows.length);
            data.rows.forEach(function(entry){
               $('#criminal_list_container')
               .append("<div class='criminal_div'><img src='/"+entry.image+".png' class='mugshot'><div>Sin: "+entry.sin+"</div><div>Name: "+entry.name+"</div><div>Wanted for: "+entry.type+"</div><button class='edit_button' data-edit-id="+entry.sin+" type='button'>Edit</button><button class='delete_button' data-delete-id='"+entry.sin+"' type='button'>Free Prisoner</button></div");
            })
        }
    })
}

function closeButtonHandler(){
    $('#list_modal').css('display','none');
}

function editButtonHandler(event){
    var oldsin = $(this).attr("data-edit-id");

    $.ajax({
        method: 'POST',
        url:'/geteditinfo',
        dataType:'json',
        data:{sin:oldsin},
        success: function(data){
            var result = data.rows[0];
            var editData = {
                sin : result.sin,
                name: result.name,
                size: result.size,
                height: result.height,
                type: result.type,
                image: result.image
            }
            
            $('#edit_name').val(editData.name);
            $('#edit_size').val(editData.size);
            $('#edit_height').val(editData.height);
            $('#edit_image_head').attr("data-current",editData.image);
            $('#edit_image_head').attr("src","/"+editData.image+".png");
            $('#edit_modal').css("display","flex");
            $('#sinnum').empty()
            $('#sinnum').append("sin:"+editData.sin);
            $('#save_edit').attr("data-save-id",editData.sin);

        }
    })
}

function saveEditHandler(){
    var data ={
        name: $('#edit_name').val(),
        size: $('#edit_size ').val(),
        height: $('#edit_height').val(),
        type: $('#edit_crime_type').children("option:selected").val(),
        image: $('#edit_image_head').attr("data-current"),
        sin: $('#save_edit').attr("data-save-id")
    }

    $.ajax({
        method: 'POST',
        url: '/editcriminal',
        data: data,
        success: function(res){
            if(res == "error"){
                alert("A person with the SIN is already in jail!");
            }else{
                $('#edit_modal').css("display","none");
                listButtonHander();

            }
        }
    })
}

function cancelEditHandler(){
    $('#edit_modal').css("display","none");
}
function deleteButtonHandler(event){
    $.ajax({
        method: "POST",
        url:'/deletecriminal',
        data: {
            sin: $(this).attr('data-delete-id')
        },
        success: function(){
            listButtonHander();
        }
    })
}

function filterSelection(selection){
    var data;
    $(".active").toggleClass('active');
    $(this).toggleClass('active');
    if(selection == "all"){
        $.ajax({
            method:"GET",
            url:'/getallcriminals',
            success: function(data){
                $('#item_container').empty();
                data.forEach(person => {
                    var width = calculateDim(person.size);
                    var height = calculateDim(person.height);
                    $('#item_container').append("<div class='filterDiv'><div><img class='criminal_image' width= '"+width+"' height='"+height+"' data-current = '"+person.sin+"' src='/"+person.image+".png'></div><div class='crimname'>name:"+person.name+"</div><div class='crimname'>sin:"+person.sin+"</div></div>");
                })
            }
        })
    }
    else{
        $.ajax({
            method:"POST",
            url:'/gettypecriminals',
            data:{
                type:selection
            },
            success: function(data){
                $('#item_container').empty();
                data.forEach(person => {
                    var width = calculateDim(person.size);
                    var height = calculateDim(person.height);
                    $('#item_container').append("<div class='filterDiv'><div><img class='criminal_image' width= '"+width+"' height='"+height+"' data-current = '"+person.sin+"' src='/"+person.image+".png'></div><div class='crimname'>name:"+person.name+"</div><div class='crimname'>sin:"+person.sin+"</div></div>");
                })
            }
        })
    }
}

function calculateDim(size){
    var scale = {
        xs : "100px",
        s : "130px",
        m : "170px",
        l : "210px",
        xl : "250px"
    }
    if(size <=60){
        return "100px";
    }

    if(size >60 && size <=120){
        return "130px";
    }

    if(size >120 && size <=180){
        return "170px";
    }

    if(size >180 && size <=240){
        return "210px";
    }

    if(size >240 && size <=300){
        return "250px";
    }
}

function crimimageclick(event){
    var sin = $(this).attr("data-current");
    $.ajax({
        method:'POST',
        url: '/geteditinfo',
        data: {
            sin: sin
        },
        success: function(data){
            $('#detail_image_head').attr("src",'/'+data.image+'.png');
            $('#sinnum').empty();
            $('#sinnum').append('Sin: '+data.sin+'');
            $('#name').empty();
            $('#name').append('Name: '+data.name+'');
            $('#size').empty();
            $('#size').append('Size(lb): '+data.size+'');
            $('#height').empty();
            $('#height').append('Height(lb): '+data.height+'');
            $('#crime').empty();
            $('#crime').append('Crime: '+data.type+'');

            $('#detail_modal').css("display","flex");
        }
    })
}

function closeDetail(){
    $('#detail_modal').css("display","none");
}

  


