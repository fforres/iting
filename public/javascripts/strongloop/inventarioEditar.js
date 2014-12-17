$(".item").on("click",function(e){
	$(this).find(".movimientos").show(200);
})


$(".movimientos input")
	.on("change",function(e){
		paintEdited($(this));
	})
	.on("blur",function(e){
		validarInput($(this));
	})

function validarInput(elInput){
		var value=elInput.val();
		if(value.lastIndexOf(",") == -1)
		{
			if(value.lastIndexOf(".") == -1)
			{
				if(parseInt(value)){
					guardarElValor(elInput,parseInt(value))
				}else{
					paintError(elInput, "Revise el valor ingresado, ¿Seguro que está bien escrito?");
				}
			}else{
				// TIENE PUNTO
				if(parseFloat(value)){
					guardarElValor(elInput,parseFloat(value))
				}else{
					paintError(elInput, "Revise el valor ingresado, ¿Seguro que está bien escrito?");
				}
			}
			
		}else{
			// TIENE COMA
			paintError(elInput,"El campo no puede contener comas ( , ) para anoptar decimales, utilize puntos ( . )");
		}

}

function guardarElValor(input){
	paintLoading(input);
	var id=input.data("id")
	var value=input.val();
	
	var ob= {
		cantidad:value
	}
	
	$.ajax({
		url: API_URL + "/historialesdescripciones/"+id,
		data:ob,
		type:"PUT",
		success:function(data){
			console.log(data)
			input.val(data.cantidad)
			paintSuccess(input);
		},
		error:function(data){
			paintError(input, "Tuvimos un problema guardando los datos");
		}
	})
}

function paintError(input,msg){
	input.parents(".movimientos").removeClass("nuevo").find("span").html("<span class='fa fa-fw fa-exclamation-triangle'></span>")
	input.parents(".form-group").find(".error").html("<p>"+msg+"</p>").show(200)
}
function paintEdited(input){
	input.parents(".movimientos").removeClass("nuevo").find("span").html("<span class='fa fa-fw fa-circle-o-notch fa-spin'></span>")
	input.parents(".form-group").find(".error").html("").hide(200)
}
function paintSuccess(input){
	input.parents(".movimientos").removeClass("nuevo").find("span").html("<span class='fa fa-fw fa-check'></span>")
	input.parents(".form-group").find(".error").html("").hide(200)

}
function paintLoading(input){
	input.parents(".movimientos").removeClass("nuevo").find("span").html("<span class='fa fa-fw fa-circle-o-notch fa-spin'></span>")
}