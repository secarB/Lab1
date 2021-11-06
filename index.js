load();
/**
 * load old result .. 
 */
 function load(){
    console.log("Starting");
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'tiredwithphp.php',true);
    xhttp.send();
    xhttp.onload = function () {
        if (xhttp.status != 200) {
            alert(`Error ${xhttp.status}: ${xhttp.statusText}`);
            alert(xhttp.responseText);
        } else {
            console.log(xhttp.responseText);
            let result = JSON.parse(xhttp.responseText)
            for (let i in result.response){
                if (result.response[i].validate) {
                    let newRow = '<tr>';
                    newRow += '<td>' + result.response[i].xval + '</td>';
                    newRow += '<td>' + result.response[i].yval + '</td>';
                    newRow += '<td>' + result.response[i].rval + '</td>';
                    newRow += '<td>' + result.response[i].curtime + '</td>';
                    newRow += '<td>' + result.response[i].scripttime + '</td>';
                    newRow += '<td>' + result.response[i].inarea + '</td>';
                    $('#result-table').append(newRow);
                }
            }

        }
    };
}
$("#x-values :button").click(function () {
    $("#x-values :button").removeClass("active") 
    $(this).addClass("active")
});
let elemWithErrors=document.getElementById('button')
let errorX=document.createElement("p");
errorX.textContent = "X can't be empty";
let inputY;
let inputX;
function validateX() {
    let x_element = $("#x-values :button.active")[0]
    if (x_element===undefined) {   
        $('#errors').append(errorX);
        showError($('#x-values'));
        return false;
    } else {
        errorX.remove();
        hideError($('#x-values'));
        inputX = x_element.value;
        return true;
    }
}
let errorY1= document.createElement("p");
errorY1.textContent = "Y must be number";
let errorY2= document.createElement("p");
errorY2.textContent = "Y in (-3,3)";
let errorY3= document.createElement("p");
errorY3.textContent = "Y can't be empty";
function validateY() {
    const Y_MIN = -3;
    const Y_MAX = 3;
    let yField = $('#y-name');
    inputY = yField.val().replace(',', '.');
    if(inputY==""){
        errorY1.remove();
        errorY2.remove();
        $('#errors').append(errorY3);
        showError($('#y-values'))
        return false;
    }else{
        if ((/[^0-9.-]/i.test(inputY))){
            errorY2.remove();
            errorY3.remove();
            $('#errors').append(errorY1);
            showError($('#y-values'));
            return false;
        }else{

            if (inputY > Y_MIN && inputY < Y_MAX){
                errorY1.remove();
                errorY2.remove();
                errorY3.remove();
                hideError($('#y-values'));
                return true;
            }else{
                errorY1.remove();
                errorY3.remove();
                $('#errors').append(errorY2);
                showError($('#y-values'));
                return false;
            }
        }

    }
}
let multipleR;
let errorR= document.createElement("p");
errorR.textContent = "R can't be empty";
function validateR() {
    let checkboxes=document.getElementsByName('z');
    multipleR=[];
    if ($('.r-checkbox ').is(':checked')) {
        checkboxes.forEach(checkbox=> {
            if (checkbox.checked){
                multipleR.push(checkbox.value);
            }
        });
        errorR.remove();
        hideError($('#r-values'));
        return true;
    } else {
        showerror($('#r-values'));
        $('#errors').append(errorR);
        return false;
    }
}
function validateForm() {
    validateX();
    validateY();
    validateR();
    if (validateX() && validateY() && validateR()){
        hideError($('#errors'));
        return true;
    }else{
        $('#errors p').css("text-align","center");
        showError($('#errors'));
        return false;
    }
}
function showError(elem){
    elem.css("border","2px solid #f50505");
    elem.css("box-shadow", "inset 0px 0 2px 1px #f50505");
}
function hideError(elem){
    elem.css("border","");
    elem.css("box-shadow", "");
}

/**
 * submit 
 */
$('#main-form').on('submit', function(event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    } else {
        let data= 'x='+inputX+'&y='+inputY;
        for (let i=0;i<multipleR.length;i++){
            data+='&r[]='+multipleR[i];
        }

        data += '&timezone=' + new Date().getTimezoneOffset();
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', 'tiredwithphp.php'+'?'+data,true);
        xhttp.send();
        xhttp.onload = function () {
            if (xhttp.status != 200) {
                alert(`Error ${xhttp.status}: ${xhttp.statusText}`);
                alert(xhttp.responseText);
            } else {
                console.log("submitted");
                console.log(xhttp.responseText);
                let result = JSON.parse(xhttp.responseText);

                for (let i in result.response){
                    if (result.response[i].validate) {
                        let newRow = '<tr>';
                        newRow += '<td>' + result.response[i].xval + '</td>';
                        newRow += '<td>' + result.response[i].yval + '</td>';
                        newRow += '<td>' + result.response[i].rval + '</td>';
                        newRow += '<td>' + result.response[i].curtime + '</td>';
                        newRow += '<td>' + result.response[i].scripttime + '</td>';
                        newRow += '<td>' + result.response[i].inarea + '</td>';
                        $('#result-table').append(newRow);
                    }
                }

            }
        };

    }
});