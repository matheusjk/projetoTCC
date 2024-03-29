function corInput () { 
    $('.form-control').css({
        "outline" : "1",
        "box-shadow" : "0 0 0 0",
        "border": "0 none"
    })

    $('.form-control').addClass('border-bottom')

    $('input').focus(function(){
        $(this).addClass('border-primary rounded-0');
    });

        
    $('input').blur(function () {
        $(this).removeClass('border-primary');
    });

}

document.addEventListener('DOMContentLoaded', function(event){  // assim que o DOM carregar chamar funcao dos inputs
    corInput () 
}) 


window.setTimeout(function() {
    if($(".alert").is(":visible")){
        $(".alert").fadeTo(500, 0).slideUp(500,
            function(){
                $(this).remove();
            });
    }
    }, 4000);



function pegaToken(csrf_token){
    // var csrf_token = $("#formConfigEdit #csrf_token").val()
    
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token)
            }    
        }
    })
}


window.setInterval(function() {
    console.log("passou 30 segundos");
    console.log(document.cookie);

    if(document.cookie == null || document.cookie.length <= 0){
        if(document.URL.split("/")[4] == "login"){
            console.log("JA ESTOU NA PAGINA DE LOGIN");
        }else if(document.URL.split("/")[4] == "register" || document.URL.split("/")[4] == "register" || document.URL.split("/")[4] == "recuperar" || document.URL.split()[4] == "recuperar"){
            // alert(document.cookie);
            console.log("NADA A FAZER");
        }else {
            voltaPaginaPrincipal();
        }
    }
}, 30000); // 15 min 900000



if(document.URL.split("/")[4] == "login" || document.URL.split("/")[4].includes('login')){ // || document.querySelectorAll('.bi-eye').length != 0
    // console.log(navigator.userAgentData.mobile)
    // window.alert(navigator.userAgentData.mobile)

    document.querySelectorAll('.bi-eye')[0].addEventListener('touchstart', function(){
        document.querySelectorAll('#senha')[0].type = 'text';
        // window.alert('VOCE DEU TOUCH')
    });

    document.querySelectorAll('.bi-eye')[0].addEventListener('touchend', function(){
        document.querySelectorAll('#senha')[0].type = 'password';
        // window.alert('VOCE DEU TOUCH')
    });

    document.querySelectorAll('.bi-eye')[0].addEventListener('mousedown', function(){
        document.querySelectorAll('#senha')[0].type = 'text';
    });

    document.querySelectorAll('.bi-eye')[0].addEventListener('mouseup', function(){
        document.querySelectorAll('#senha')[0].type = 'password';
    });

    document.querySelectorAll('.bi-eye')[0].addEventListener('mousemove', function(){
        document.querySelectorAll('#senha')[0].type = 'password';
    });
    
}else if(document.URL.substring(document.URL.lastIndexOf('/') + 1) == "register"){
    document.querySelectorAll('.bi-eye')[0].addEventListener('mousedown', function(){
        document.querySelectorAll("#senha")[0].type = 'text';
    });

    document.querySelectorAll('.bi-eye')[0].addEventListener('mouseup', function(){
        document.querySelectorAll('#senha')[0].type = 'password';
    });

    document.querySelectorAll('.bi-eye')[0].addEventListener('mousemove', function(){
        document.querySelectorAll('#senha')[0].type = 'password';
    });

    document.querySelectorAll('.bi-eye')[1].addEventListener('mousedown', function(){
        document.querySelectorAll('#confirmarSenha')[0].type = 'text';
    });

    document.querySelectorAll('.bi-eye')[1].addEventListener('mouseup', function(){
        document.querySelectorAll('#confirmarSenha')[0].type = 'password';
    });

    document.querySelectorAll('.bi-eye')[1].addEventListener('mousemove', function(){
        document.querySelectorAll("#confirmarSenha").type = 'password';
    });

   

    var cpf = document.querySelector('#cpf');
    cpf.addEventListener("blur", function(){
        if(cpf.value) cpf.value = cpf.value.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-");  // match faz uma busca na string por uma correspondencia contra a expressao regular e retorna essa correspondencia num objeto Array
    });

    // document.querySelectorAll('#tel')[0].addEventListener('onfocusout')
   var telEvent = document.querySelector("#tel");
   telEvent.addEventListener("blur", function() {
   
        var tel = document.getElementById("tel");
        const telAjustado = tel.value.replace(/\-/g, '');
        if (tel.value.length === 9){
            const parte1 = telAjustado.slice(0,5);
            const parte2 = telAjustado.slice(5,9);
            var telFormatado = 21 + `${parte1}-${parte2}`;
            // console.log(telFormatado);
        }else{
            const parte1 = telAjustado.slice(0,4);
            const parte2 = telAjustado.slice(4,8);
            var telFormatado = 21 + `${parte1}-${parte2}`;
            // console.log(telFormatado);
        }
        tel.value = telFormatado;
    })
} 

function comboboxSelected(id){
    
    var url = "/config/formulario/"+id.substring(id.lastIndexOf('/')+1);
    // alert(url);
    $.ajax({
        url: url,
        type: "GET",
        success : function(response){
            // alert(response);
            console.log(response);
            console.log(JSON.stringify(response));
          
            if (response.dadosConfigsWiFi == false){
                $("#resetarConfigsWifi option").filter(function() {
                    return $(this).text() == "NAO";
                }).prop("selected", true);
            }else if (response.dadosConfigsWiFi == true) {
                $("#resetarConfigsWifi option").filter(function() {
                    return $(this).text() == "SIM";
                }).prop("selected", true);
            }

            if (response.dadosAlertaEmail == false){
                $("#alertaEmail option").filter(function() {
                    return $(this).text() == "NAO";
                }).prop("selected", true);
            }else if (response.dadosAlertaEmail == true){
                $("#alertaEmail option").filter(function() {
                    return $(this).text() == "SIM";
                }).prop("selected", true);
            }

            if (response.dadosUsuario){
                var el = document.getElementById("usuario_id");

                for(var i = 0; i < el.length; i++){
                    console.log(el.options[i].text);
                    console.log(el.options[i].index);
                    if(el.options[i].index == response.dadosUsuario-1){
                        //el.options[i].selected = true;
                        $("#usuario_id option").filter(function(){
                            return $(this).text() == el.options[i].text;
                        }).prop("selected", true);
                    
                    }  
                }
              
            }
        }
    }); 

}


function comboboxSelectedLocal(id){
      
    var url = "/local/formulario/"+id.substring(id.lastIndexOf('/')+1);
    // alert(url);
    $.ajax({
        url: url,
        type: "GET",
        success : function(response){
            // alert(response);
            console.log(response);
            console.log(JSON.stringify(response));
           
            if (response.dadosUsuario){
                var el = document.getElementById("usuario_id");

                for(var i = 0; i < el.length; i++){
                    console.log(el.options[i].text);
                    console.log(el.options[i].index);
                    if(el.options[i].index == response.dadosUsuario-1){
                        //el.options[i].selected = true;
                        $("#usuario_id option").filter(function(){
                            return $(this).text() == el.options[i].text;
                        }).prop("selected", true);
                    
                    }  
                }

            }
        }
    }); 

}

function comboboxSelectedUsuario(id){
    var url = "/form/formulario/"+id.substring(id.lastIndexOf('/')+1);
    // alert(url);
    $.ajax({
        url: url,
        type: "GET",
        success : function(response){
            // alert(response);
            console.log(response);
            console.log(JSON.stringify(response));
            // var dados = JSON.parse(response);
            // console.log(dados.dados);
            if (response.dadosTipoUsuario == 1){
                $("#tipoUsuario option").filter(function() {
                    return $(this).text() == "ADMINISTRADOR";
                }).prop("selected", true);
            }else if (response.dadosTipoUsuario == 2) {
                $("#tipoUsuario option").filter(function() {
                    return $(this).text() == "COMUM";
                }).prop("selected", true);
            }           
        }
    }); 
}


function voltaPaginaPrincipal(){
    window.location.pathname = '/form/login';
}


function consultaCep(){
    var cep = document.querySelectorAll('.show')[0].querySelector('#cep').value;

    if(cep == ''){
        $("#formLocalEdit").addClass('needs-validation')
        $("#formLocalEdit #cep").addClass('is-invalid')
        $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
            'class': 'invalid-feedback'
        }).appendTo('#formLocalEdit .form-group');
        $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
    }else{
        $("#formLocalEdit #cep").removeClass('is-invalid')
        // $(".invalid-feedback").html()
        $("#cep").keydown(function(){
            $('.invalid-feedback').fadeOut(1600, function() {
                $('.invalid-feedback').html('')
            })
        })
       
    

        var url = "https://viacep.com.br/ws/"+ cep +"/json/";

        console.log(url);

        $.ajax({
            url: url,
            type: "GET",
            success: function(response){
                console.log(response);
       
                if(response.erro){
                    alert("NAO CONSEGUIMOS ENCONTRAR SEU CEP :(");
                    document.querySelectorAll('.show')[0].querySelector('#bairro').value = null;
                    document.querySelectorAll('.show')[0].querySelector('#cidade').value = null;
                    document.querySelectorAll('.show')[0].querySelector('#estado').value = null;
                    document.querySelectorAll('.show')[0].querySelector('#endereco').value = null;
                }else{
                    document.querySelectorAll('.show')[0].querySelector('#bairro').value = response.bairro;
                    document.querySelectorAll('.show')[0].querySelector('#cidade').value = response.localidade;
                    document.querySelectorAll('.show')[0].querySelector('#estado').value = response.uf;
                    document.querySelectorAll('.show')[0].querySelector('#endereco').value = response.logradouro;
                }
                
            },
            error: function(response){
                console.log(response)
                alert("NAO CONSEGUIMOS ENCONTRAR SEU CEP :(");
                document.querySelectorAll('.show')[0].querySelector('#bairro').value = null;
                document.querySelectorAll('.show')[0].querySelector('#cidade').value = null;
                document.querySelectorAll('.show')[0].querySelector('#estado').value = null;
                document.querySelectorAll('.show')[0].querySelector('#endereco').value = null;
            }
        })
    }
}



function atualizarTelemetria(){
    var url = "/telemetria/listar";

    console.log(url);

    $.ajax({
        url: url,
        type: "GET",
        success: function(response){
            console.log(response);
           
        }
    })
}


function chamaTelemetria(){
   
    var tabela = $('#myTable').DataTable({
        "ajax": "http://192.168.0.14:59000/telemetria/listarTelemetriaJson",
        "columns": [
            {"data": "id"},
            {"data": "NOME"},
            {"data": "SENSORG"},
            {"data": "SENSORT"},
            {"data": "SENSORU"},
            {"data": "dataCriacao"}
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
        },
        retrieve: true,
        paging: true
        
        });

    setInterval(function(){
        // tabela.clear();
        // tabela.draw();
        // tabela.ajax.url("https://192.168.0.13:59000/telemetria/listarTelemetriaJson").load();
        // tabela.draw();
        // tabela.destroy();
        // tabela.draw();
        tabela.ajax.reload();
        
    }, 300000);
}

function chamaTabelaEstatica(){
    $("#myTable").DataTable({
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
        },
        retrieve: true,
        paging: true
    });
}


function calculaIdade(){

    let dataAtual = new Date()
    let dtAtualNasc = document.querySelectorAll("#dataNascimento")[0].value
    let dtNascData = new Date(dtAtualNasc)

    // if(dataAtual.getMonth()+1 < dtNascData.getMonth()+1){
    //     document.querySelectorAll("#idade")[0].value = (dataAtual.getFullYear() - dtNascData.getFullYear()) - 1
    // }
    

    if(dataAtual.getMonth()+1 == dtNascData.getMonth()+1 || dataAtual.getMonth()+1 > dtNascData.getMonth()+1){
        console.log("EH IGUAL")
        let total = (dataAtual.getFullYear() - dtNascData.getFullYear())
        console.log(`VOCE TEM ${total} anos de idade`)

        // document.querySelectorAll("#dataNascimento")[0].addEventListener('change', function(){
        document.querySelectorAll("#idade")[0].value = total
        // })


    }else {
        console.log("NAO EH IGUAL")
    }
}

function deletaUsuarios(tabelaUsuarios){
    $("#myTable").on("click", ".btn-outline-danger", function(evento) {

        var escolha = window.confirm("Deseja realmente deletar esse usuário? O sistema poderá apresentar alguns erros.")
        if(escolha){
            $.ajax({
                url: "/form/excluirUsuarios/" + Number.parseInt(evento.target.id),
                type: 'DELETE',
                success: function(response){
                    $.notify('Sucesso ao deletar usuário', 'success')
                    tabelaUsuarios.ajax.reload()
                },
                error: function(error) {
                    $.notify('Error ao deletar usuários' + error, 'error')
                }
            })
        }else {
            alert("Usuário não foi deletado")
        }
    })

    pegaToken($("#formUsuarioEdit #csrf_token").val())
}


function editaUsuarios(tabelaUsuarios){

    let tabela = document.querySelector("#myTable")
    let btnEdita = document.querySelector(".btn-outline-warning")
    
    $("#myTable").on("click", ".btn-outline-warning", function(evento){
        console.log(evento.target.id, typeof(evento.target.id))

        $.ajax({
            url: "/form/editarPesquisarUsuarioJson/" + Number.parseInt(evento.target.id),
            type: "GET",
            success: function (response) {
                $("#editarUsuariosCabecalho").html("Editar Usuario")
                $("#modaledit").modal("show")
                $("#formUsuarioEdit #id").val(evento.target.id)
                $("#formUsuarioEdit #nome").val(response.data.nome)
                $("#formUsuarioEdit #email").val(response.data.email)
                $("#formUsuarioEdit #sexo").val(response.data.sexo)
                $("#formUsuarioEdit #telefone").val(response.data.tel)
                $("#formUsuarioEdit #idade").val(response.data.idade)
                $("#formUsuarioEdit #cpf").val(response.data.cpf)

                novaData = new Date(response.data.dataNasc)
                let novaDataInput = novaData.getUTCDate().toString().padStart(2, '0') + "/" + (novaData.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaData.getFullYear().toString()

                console.log(novaDataInput)
                console.log(novaData.getFullYear() + "-" + "0" +(novaData.getUTCMonth()+1) + "-" + novaData.getUTCDate())

                // novaData.getFullYear() + "-" + novaData.getUTCMonth()+1 + "-" + novaData.getUTCDate()
                
                $("#formUsuarioEdit #dataNascimento").val(novaData.getFullYear().toString() + "-" + (novaData.getUTCMonth()+1).toString().padStart(2, '0') + "-" + novaData.getUTCDate().toString().padStart(2, '0')) 

                // novaData.getFullYear() + "-" + "0" + (novaData.getUTCMonth()+1) + "-" + novaData.getUTCDate()
               
                var cont = $.map($("#formUsuarioEdit #tipo_usuario"), function(e){
                    return (e.length)
                })

                console.log(cont)
                $.each(response.data.tiposUsuariosGeral, function(i, d){
                    if(response.data.tiposUsuariosGeral.length == cont){

                    }else{
                        $("#formUsuarioEdit #tipo_usuario").append($('<option>', { "value": d[0] }).text(d[1]))
                    }
                })
                    
                $("#formUsuarioEdit #tipo_usuario option").filter(function() {
                    return $(this).val() == response.data.tipoUsuario
                }).prop("selected", true)
                
                document.querySelectorAll("#dataNascimento")[0].addEventListener('change', function(){
                    // document.querySelectorAll("#idade")[0].value = total
                    calculaIdade()
                })
                
            }
        }).fail(function(data, err, opt){
            console.log('Erro ao consultar usuario a ser alterado'+ data.responseText + err + opt) // + err + opt)
            $.notify('Erro ao consultar usuario a ser alterado'+ data + err + opt, 'error')
        })
    })
    calculaIdade()
    let url = "/form/editarUsuarioJson"

    $("#edit_action").click(function(e){
        e.preventDefault()

        let data = {
            id: Number.parseInt($("#formUsuarioEdit #id").val()),
            nome: $("#formUsuarioEdit #nome").val(),
            email: $("#formUsuarioEdit #email").val(),
            sexo: $("#formUsuarioEdit #sexo").val(),
            telefone: $("#formUsuarioEdit #telefone").val(),
            cpf: $("#formUsuarioEdit #cpf").val(),
            idade: Number.parseInt($("#formUsuarioEdit #idade").val()),
            dataNascimento: $("#formUsuarioEdit #dataNascimento").val(),
            tipoUsuario: Number.parseInt($("#formUsuarioEdit #tipo_usuario").val())
        }

        console.log(JSON.stringify(data))

        $.ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(data),
            dataType: 'json',
            encode: true,
            contentType: "application/json, charset=UTF-8",
            processData: false,
        }).done(function(data){
            $.notify('Sucesso ao atualizar usuario', 'success')
            $("#modaledit").modal("hide")
            tabelaUsuarios.ajax.reload()
        }).fail(function(data, err, opt){
            console.log('Erro ao atualizar usuario'+ data.responseText + err + opt) // + err + opt)
            $.notify('Erro ao atualizar usuario'+ data + err + opt, 'error')
        })
    })

    pegaToken($("#formUsuarioEdit #csrf_token").val())
    
}


function configuraSelectConfig(tag){
    var valores = [$(tag+" #resetarConfigsWifi option").length, $(tag+" #alertaEmail option").length]
    if(valores[0] <= 1){

        $(tag+" #resetarConfigsWifi").append($('<option>', {
            value: 1,
            text: 'SIM'
        }))

        $(tag+" #resetarConfigsWifi").append($('<option>', {
            value: 0,
            text: 'NAO'
        }))

        $(tag+" #alertaEmail").append($('<option>', {
            value: 1,
            text: 'SIM' 
        }))

        $(tag+" #alertaEmail").append($('<option>', {
            value: 0,
            text: 'NAO'
        }))
    }
}

function insereConfigJson(tabelaConfig){

    $(".btn-outline-success").click(function(){
        configuraSelectConfig("#formAdicionarConfig ");
        
        $.ajax({
            url: '/config/listaUsuarios',
            type: "GET",
            success: function(response) {
                // console.log(response.data)
                var cont = $("#formAdicionarConfig #usuario_id option").length

                // if(response.data["tipoUsuario"] == 1){

                    $.each(response.data.usuariosIdNome, function(i, d){ // i - value | d - texto/informaçao 
                        // $('<option>').val(i).text(d[1]).appendTo(options);
                        if(response.data.usuariosIdNome.length == $("#formAdicionarConfig #usuario_id option").length){
                            // console.log(cont)
                        }else{
                            $('#formAdicionarConfig #usuario_id').append($('<option>', { "value" : d[0] }).text(d[1]))  // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
                        }
                    })
                    // console.log("CONTADOR DE NOME " + cont)
                    // if(Object.keys(response.data.id).length == cont){
                    //     $('#formAdicionarConfig #usuario_id').append($('<option>', { "value" : response.data.id }).text(response.data.nomeUsuario)) // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
                        
                    // }else{
                    //     console.log(cont)
                    // }
                // }
                // }else {
                   
                // }
            }
        }).fail(function(xhr, statusText, err){
            // alert(`Error Code: ${xhr.status} | Texto Error: ${xhr.responseText} | ${statusText}`)
            $('#formAdicionarConfig #usuario_id').append($('<option>', { "value" : 0 }).text(`${xhr.responseText}`))
        })
        
    })
    


    var btnEnviar = document.querySelectorAll("#submit")
    
    var url = "/config/registrarConfiguracoes"
    // console.log(JSON.stringify(data), $('#tempoTelemetria').val(), data)
    // $.post(url, data);
//    $(document).ready(function() {
    //    $(document).ready(function() {
        $("#mymodal").on('shown.bs.modal', function(event){
            // alert('modal fechou')
            if($('#formAdicionarConfig #tempoTelemetria').val() == '' || $('#formAdicionarConfig #tempoGeolocalizacao').val() == '' || $('#formAdicionarConfig #tempoSoneca').val() == '' || $('#formAdicionarConfig #tempoThingSpeak').val() == '' || $('#formAdicionarConfig #urlIpApi').val() == '' || $('#formAdicionarConfig #urlThingSpeak').val() == '' || $('#formAdicionarConfig #secretKeyThingSpeak').val() == ''){
                $('#formAdicionarConfig').addClass('needs-validation')
                $('#formAdicionarConfig #tempoTelemetria').addClass('is-invalid')

                $('#formAdicionarConfig #tempoTelemetria').addClass('is-invalid')
                $('#formAdicionarConfig #tempoGeolocalizacao').addClass('is-invalid')
                $('#formAdicionarConfig #tempoSoneca').addClass('is-invalid')
                $('#formAdicionarConfig #tempoThingSpeak').addClass('is-invalid')
                $('#formAdicionarConfig #urlIpApi').addClass('is-invalid')
                $('#formAdicionarConfig #urlThingSpeak').addClass('is-invalid')
                $('#formAdicionarConfig #secretKeyThingSpeak').addClass('is-invalid')
                // $('#formAdicionarConfig #tempoTelemetria').addClass('is-invalid')
                $('<div/>', {
                    'class': 'invalid-feedback'
                }).appendTo('#formAdicionarConfig .form-group')
                $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
            }else {
                
                $('.invalid-feedback').fadeOut(1600, function() {
                   $('#formAdicionarConfig #tempoTelemetria').removeClass('is-invalid')
                   $('#formAdicionarConfig #tempoTelemetria').removeClass('invalid-feedback')

                   $('#formAdicionarConfig #tempoGeolocalizacao').removeClass('is-invalid')
                   $('#formAdicionarConfig #tempoGeolocalizacao').removeClass('invalid-feedback')

                   $('#formAdicionarConfig #tempoSoneca').removeClass('is-invalid')
                   $('#formAdicionarConfig #tempoSoneca').removeClass('invalid-feedback')

                   $('#formAdicionarConfig #tempoThingSpeak').removeClass('is-invalid')
                   $('#formAdicionarConfig #tempoThingSpeak').removeClass('invalid-feedback')

                   $('#formAdicionarConfig #urlIpApi').removeClass('is-invalid')
                   $('#formAdicionarConfig #urlIpApi').removeClass('invalid-feedback')

                   $('#formAdicionarConfig #urlThingSpeak').removeClass('is-invalid')
                   $('#formAdicionarConfig #urlThingSpeak').removeClass('invalid-feedback')

                   $('#formAdicionarConfig #secretKeyThingSpeak').removeClass('is-invalid')
                   $('#formAdicionarConfig #secretKeyThingSpeak').removeClass('invalid-feedback')

                //    $('#formAdicionarConfig #tempoTelemetria').removeClass('is-invalid')
                //    $('#formAdicionarConfig #tempoTelemetria').removeClass('invalid-feedback')
                
                   $('.invalid-feedback').html()
                        
                })
                // if($('#tempoTelemetria .invalid-feedback').length == 0){
                //     $('#formConfig #tempoTelemetria').removeClass('is-invalid')
                // }
                // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
                // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
                // $('.invalid-feedback').html()
            }
        
        })

       

        // $('.invalid-feedback').fadeOut(1600, function() {
        //     $('#formConfig #tempoTelemetria').removeClass('is-invalid')
        //     $('.invalid-feedback').html()
        // })

        // $('#formConfig #tempoTelemetria').blur(function(){
        //     if($('#formConfig #tempoTelemetria').val() == ''){
        //         $('#formConfig').addClass('needs-validation')
        //         $('#formConfig #tempoTelemetria').addClass('is-invalid')
        //         $('<div/>', {
        //             'class': 'invalid-feedback'
        //         }).appendTo('#formConfig .form-group')
        //         $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
        //     }else {
        //         $('.invalid-feedback').fadeOut(1600, function() {
        //             // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
        //             $('.invalid-feedback').html('')
        //         })
        //         // if($('#tempoTelemetria .invalid-feedback').length == 0){
        //         //     $('#formConfig #tempoTelemetria').removeClass('is-invalid')
        //         // }
        //         // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
        //         // $('.invalid-feedback').html()
        //     }    
        // })           

        document.addEventListener('keydown', function(e){
            e = e || window.event
            var codigo =  e.key
            console.log("Tecla pressionada eh " + codigo + " traduçao " + String.fromCharCode(codigo))
            $('.invalid-feedback').fadeOut(1600, function() {
                // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
                $('.invalid-feedback').html()
                // $('.is-invalid').html()
                // $('#formAdicionarConfig #tempoTelemetria').removeClass('invalid-feedback')
                $('#formAdicionarConfig #tempoTelemetria').removeClass('is-invalid')
                $('#formAdicionarConfig #tempoTelemetria').addClass('is-valid')
            })
            // $('.is-invalid').fadeOut(1600, function() {
                // $('#formAdicionarConfig #tempoTelemetria').removeClass('is-invalid')
                
            // })
            // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
            // if($('#tempoTelemetria .invalid-feedback').length == 0){
                
            // }
            // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
            // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
            // $('.invalid-feedback').html()
        })

           $("#submit_action").click(function(e){
                e.preventDefault();

                // document.addEventListener('keydown', function(e){
                //     e = e || window.event
                //     var codigo =  e.key || e.which 
                //     console.log("Tecla pressionada eh " + codigo + " traduçao " + String.fromCharCode(codigo))
                // })

                
                if($('#formAdicionarConfig #tempoTelemetria').val() == ''){
                    $('#formAdicionarConfig #tempoTelemetria').addClass('needs-validation')
                    $('#formAdicionarConfig #tempoTelemetria').addClass('is-invalid')
                    $('<div/>', {
                        'class': 'invalid-feedback'
                    }).appendTo('#formAdicionarConfig .form-group')
                    $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
                }else {
                    $('#formAdicionarConfig #tempoTelemetria').removeClass('is-invalid')
                    $('.invalid-feedback').html()
                

                    var data = {
                        tempoTel: Number.parseFloat($('#formAdicionarConfig #tempoTelemetria').val()),
                        tempoGeo: Number.parseFloat($('#formAdicionarConfig #tempoGeolocalizacao').val()),
                        tempoSoneca: Number.parseFloat($('#formAdicionarConfig #tempoSoneca').val()),
                        tempoThingSpeak: Number.parseFloat($('#formAdicionarConfig #tempoThingSpeak').val()),
                        urlIpApi: $('#formAdicionarConfig #urlIpApi').val(),
                        urlThingSpeak: $('#formAdicionarConfig #urlThingSpeak').val(),
                        tokenTelegram: $('#formAdicionarConfig #tokenTelegram').val(),
                        secretKey: $('#formAdicionarConfig #secretKeyThingSpeak').val(),
                        resetarConfigsWifi: Number.parseInt($('#formAdicionarConfig #resetarConfigsWifi').val()),
                        alertaEmail: Number.parseInt($('#formAdicionarConfig #alertaEmail').val()),
                        valorGasAviso: Number.parseFloat($('#formAdicionarConfig #valorGasAviso').val()),
                        usuarioId: Number.parseInt(($('#formAdicionarConfig #usuario_id').val()))
                    }
                    console.log(data)
                    console.log(JSON.stringify(data))
        
                    $.ajax({
                    url: url,  // "https://192.168.0.13:59000/config/registrarConfiguracoes"
                    type: "POST",
                    data: JSON.stringify(data),
                    dataType: 'json',
                    encode: true,
                    contentType: "application/json, charset=UTF-8",
                    processData: false
                
                    }).done(function(data){
                        // $("#formConfig").empty()
                        $('#formAdicionarConfig #tempoTelemetria').val(""),
                        $('#formAdicionarConfig #tempoGeolocalizacao').val(""),
                        $('#formAdicionarConfig #tempoSoneca').val(""),
                        $('#formAdicionarConfig #tempoThingSpeak').val(""),
                        $('#formAdicionarConfig #urlIpApi').val(""),
                        $('#formAdicionarConfig #urlThingSpeak').val(""),
                        $('#formAdicionarConfig #tokenTelegram').val(""),
                        $('#formAdicionarConfig #secretKeyThingSpeak').val(""),
                        $('#formAdicionarConfig #resetarConfigsWifi').val(""),
                        $('#formAdicionarConfig #alertaEmail').val(""),
                        $('#formAdicionarConfig #valorGasAviso').val(""),
                        $('#formAdicionarConfig #usuario_id').val(""),
                        $("#mymodal").modal("hide")
                        console.log(data)
                        alert($("#formAdicionarConfig #csrf_token").val())
                        $.notify('Sucesso ao inserir nova configuraçao', 'success')
                        tabelaConfig.ajax.reload()
                    }).fail(function(data, err, opt){
                        console.log('Erro ao inserir nova configuração'+ data + err + opt)
                        $.notify('Erro ao inserir nova configuração'+ data + err + opt, 'error')
                    })
                }
        })

        pegaToken($("#formAdicionarConfig #csrf_token").val())
       

}



function deletarConfigJson(tabelaConfig){
    $("#myTable").on("click", ".btn-outline-danger", function (e) {
        console.log(e.target.id, typeof(e.target.id))
        // var id = $(this).data('id');
        
        var escolha = window.confirm('Deseja realmente deletar essa configuraçao?')
        if(escolha){
            console.log('FUI DELETADO CARA!!!')
            $.ajax({
                url: "/config/excluirConfig/" + Number.parseInt(e.target.id), 
                type: "DELETE", 
                success: function (response) {
                    // alert(response.data.tempo_execucao_telemetria)
                    
                    $.notify('Sucesso ao deletar registro de configuraçoes', 'success')
                    tabelaConfig.ajax.reload()
                },
                error: function(error){
                    console.log(error.responseText)
                }
            })
        }else{
            alert('Configuraçao nao foi deletada!!!')
        }
    })
    pegaToken($("#formAdicionarConfig #csrf_token").val())
}



function editaConfigJson(tabelaConfig){
    // console.log("aqui edita")

    configuraSelectConfig("#formConfigEdit")
    
   
    $("#myTable").on("click", ".btn-outline-warning", function (e) {
        console.log(e.target.id, typeof(e.target.id))
        // var id = $(this).data('id');
        
        $.ajax({
            url: "/config/editarPesquisarConfigJson/" + Number.parseInt(e.target.id), 
            type: "GET", 
            success: function (response) {
                // alert(response.data.tempo_execucao_telemetria)
                $('#editarConfigCabecalho').html("Editar Configuracao")
                $("#modal-edit").modal("show")
                $("#id").val(e.target.id)
                $("#tempoTel").val(response.data.tempo_execucao_telemetria);
                $("#tempoGeo").val(response.data.tempo_execucao_geolocalizacao)
                $("#tempoSoneca").val(response.data.tempo_execucao_soneca)
                $("#tempoThingSpeak").val(response.data.tempo_execucao_thingspeak)
                $("#urlIpApi").val(response.data.url_ip_api)
                $("#urlThingSpeak").val(response.data.url_thingspeak)
                $("#tokenTelegram").val(response.data.token_telegram)
                $("#secretKeyThingSpeak").val(response.data.secret_key_thingspeak)
              
              
                $("#resetarConfigsWifi option").filter(function() {
                    return $(this).val() == response.data.resetar_configs_wifi
                }).prop("selected", true)
            
                
                $(" #alertaEmail option").filter(function() {
                    return $(this).val() == response.data.alerta_email
                }).prop("selected", true)
    
                
                $("#valorGasAviso").val(response.data.valor_gas_aviso)
                console.log(response.data.usuariosIdNome)
                var cont = $.map($("#usuario_id"), function(e) {
                    return (e.length)
                })

                console.log(cont)
                $.each(response.data.usuariosIdNome, function(i, d){ // i - value | d - texto/informaçao 
                    // $('<option>').val(i).text(d[1]).appendTo(options);
                    if(response.data.usuariosIdNome.length == cont){
                        console.log(cont)
                    }else{
                        $('#usuario_id').append($('<option>', { "value" : i+1 }).text(d[1]))  // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
                    }
                })
                // for(var i = 0; i < response.data.usuariosIdNome.length; i++){
                $("#usuario_id option").filter(function(){
                    return $(this).text() == response.data.usuario_id
                }).prop("selected", true)
               
            },
            error: function(error){
                console.log(error.responseText)
            }
        })
    })

    var url = '/config/editarConfiguracoesJson'

    $("#edit_action").click(function(e){
        e.preventDefault();
       
        if($('#formConfigEdit #tempoTel').val() == ''){
            $('#formConfigEdit').addClass('needs-validation')
            $('#formConfigEdit #tempoTel').addClass('is-invalid')
            $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
                'class': 'invalid-feedback'
            }).appendTo('#formConfigEdit .form-group');
            //$("#formConfigEdit #tempoTel").addClass('.invalid-feedback')
            $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
        }else{
            $('#formConfigEdit #tempoTel').removeClass('is-invalid')
            $('.invalid-feedback').html('')
        

    
            // $('#formConfigEdit #urlIpApi').val()
            var data = {
                id: Number.parseInt($("#id").val()),
                tempoTel: Number.parseFloat($('#tempoTel').val()),
                tempoGeo: Number.parseFloat($('#tempoGeo').val()),
                tempoSoneca: Number.parseFloat($('#tempoSoneca').val()),
                tempoThingSpeak: Number.parseFloat($('#tempoThingSpeak').val()),
                urlIpApi: $('#urlIpApi').val(),
                tokenTelegram: $('#tokenTelegram').val(),
                urlThingSpeak: $('#urlThingSpeak').val(),
                secretKey: $('#secretKeyThingSpeak').val(),
                resetarConfigsWifi: Number.parseInt($('#resetarConfigsWifi').val()),
                alertaEmail: Number.parseInt($('#alertaEmail').val()),
                valorGasAviso: Number.parseFloat($('#valorGasAviso').val()),
                usuarioId: Number.parseInt(($('#usuario_id').val()))
            }
            console.log(data)
            console.log(JSON.stringify(data))
            // alert($("#formConfigEdit #csrf_token").val())

            $.ajax({
            url: url,  // "https://192.168.0.13:59000/config/registrarConfiguracoes"
            type: "PUT",
            data: JSON.stringify(data),
            dataType: 'json',
            encode: true,
            contentType: "application/json, charset=UTF-8",
            processData: false
            }).done(function(data){
                $('#formConfigEdit #tempoTel').val(""),
                $('#formConfigEdit #tempoGeo').val(""),
                $('#formConfigEdit #tempoSoneca').val(""),
                $('#formConfigEdit #tempoThingSpeak').val(""),
                $('#formConfigEdit #urlIpApi').val(""),
                $('#formConfigEdit #urlThingSpeak').val(""),
                $('#formConfigEdit #tokenTelegram').val(""),
                $('#formConfigEdit #secretKeyThingSpeak').val(""),
                $('#formConfigEdit #resetarConfigsWifi').val(""),
                $('#formConfigEdit #alertaEmail').val(""),
                $('#formConfigEdit #valorGasAviso').val(""),
                $('#formConfigEdit #usuario_id').val(""),
                $("#modal-edit").modal("hide")
                console.log(data)
                // alert(data)
                $.notify('Sucesso ao atualizar o registro de configuraçoes', 'success')
                tabelaConfig.ajax.reload()
            }).fail(function(data, err, opt){
                console.log('Erro ao atualizar o registro de configuraçoes'+ data.responseText + err + opt) // + err + opt)
                $.notify('Erro ao atualizar o registro de configuraçoes'+ data + err + opt, 'error')
            })
        }
    })

    pegaToken($("#formConfigEdit #csrf_token").val()) 
    
}



function insereLocalJson(tabelaLocal){
    
    $(".btn-outline-success").click(function(){
        
        $.ajax({
            url: "/local/usuariosLocalJson", 
            type: "GET"
        }).done(function(response) {
            $("#inserirCabecalhoLocal").html("Adicionar Local")
            console.log(response.data)
            var cont = $("#formLocalAdicionar #usuario_id option").length

            console.log("CONTADOR DE NOME " + cont)
            $.each(response.data, function(i, d){ // i - value | d - texto/informaçao 
                if(response.data.length == cont){
                    console.log(cont)
                }else{
                    $('#formLocalAdicionar #usuario_id').append($('<option>', { "value" : d.idUsuario }).text(d.nomeUsuario)) // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
                }
                console.log("USUARIOS ID"+ i + " d: " + d)
            })

        }).fail(function(data, err, opt){
            console.log('Erro ao inserir local' + data.responseText + err + opt)
            $.notify('Erro ao inserir local' + data , 'error')
        })
    })

    $("#submit_action").click(function(evento){
        evento.preventDefault()

        if($("#formLocalAdicionar #endereco").val() == '' || $("#formLocalAdicionar #cidade").val() == '' || $("#formLocalAdicionar #bairro").val() == '' || $("#formLocalAdicionar #estado").val() == ''){
            if($('#formLocalAdicionar #cep').val() == ''){
                $('#formLocalAdicionar').addClass('needs-validation')
                $('#formLocalAdicionar #cep').addClass('is-invalid')
                $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
                    'class': 'invalid-feedback'
                }).appendTo('#formLocalAdicionar .form-group');
                //$("#formConfigEdit #tempoTel").addClass('.invalid-feedback')
                $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
            }else{
                $('#formLocalAdicionar #cep').removeClass('is-invalid')
                $('.invalid-feedback').html('')
            }
            // exit;
        }else {

            var data = {
                id: Number.parseInt($("#formLocalAdicionar #id").val()),
                cep: ($('#formLocalAdicionar #cep').val()),
                endereco: ($('#formLocalAdicionar #endereco').val()),
                bairro: ($('#formLocalAdicionar #bairro').val()),
                cidade: ($('#formLocalAdicionar #cidade').val()),
                estado: ($('#formLocalAdicionar #estado').val()),
                obs: $('#formLocalAdicionar #obs').val(),
                nomeUsuario: Number.parseInt($('#formLocalAdicionar #usuario_id').val())
                // usuarioId: Number.parseInt(($('#usuario_id').val()))
            }
            console.log(data)
            console.log(JSON.stringify(data))

            var url = "/local/inserirLocalJson"

            $.ajax({
            url: url,  // "https://192.168.0.13:59000/config/registrarConfiguracoes"
            type: "POST",
            data: JSON.stringify(data),
            dataType: 'json',
            encode: true,
            contentType: "application/json, charset=UTF-8",
            processData: false
            }).done(function(data){
                $('#formLocalAdicionar #cep').val(""),
                $('#formLocalAdicionar #endereco').val(""),
                $('#formLocalAdicionar #cidade').val(""),
                $('#formLocalAdicionar #bairro').val(""),
                $('#formLocalAdicionar #estado').val(""),
                $('#formLocalAdicionar #obs').val(""),
                $('#formLocalAdicionar #nomeUsuario').val(""),
                
                // $('#formConfigEdit #nomeUsuario').val(""),
                $("#modaledit").modal("hide")
                console.log(data)
                // alert(data)
                $.notify('Sucesso ao inserir o registro de local', 'success')
                tabelaLocal.ajax.reload()

            }).fail(function(data, err, opt){
                console.log('Erro ao inserir o registro de local'+ data.responseText + err + opt)
                $.notify('Erro ao inserir o registro de local'+ data + err + opt, 'error')
            })
        }
    })
    
    pegaToken($("#formLocalAdicionar #csrf_token").val())
}


function validaFormularios(formularioPrincipal, textoId){
    for(let i of formularioPrincipal){
        if($(`#${i.id}`).val() == null){
            if($(`#${i.id}`).val() == ''){
                $($(`#${textoId}`)).addClass('needs-validation')
                $(`#${i.id}`).addClass('is-invalid')
                $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
                    'class': 'invalid-feedback'
                }).appendTo(`#${textoId} .form-group`);
                //$("#formConfigEdit #tempoTel").addClass('.invalid-feedback')
                $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
            }else{
                $(`#${i.id}`).removeClass('is-invalid')
                $('.invalid-feedback').html('')
            }
        }
    }
    return true
}

function editaLocalJson(tabelaLocal){
    console.log("aqui edita")
    

    $("#myTable").on("click", ".btn-outline-warning", function (e) {
        console.log(e.target.id, typeof(e.target.id))
        // var id = $(this).data('id');

        if($("#endereco").val() == null && $("#cidade").val() == null && $("#bairro").val() == null && $("#estado").val() == null){
            if($('#formLocalEdit #cep').val() == ''){
                $('#formLocalEdit').addClass('needs-validation')
                $('#formLocalEdit #cep').addClass('is-invalid')
                $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
                    'class': 'invalid-feedback'
                }).appendTo('#formLocalEdit .form-group');
                //$("#formConfigEdit #tempoTel").addClass('.invalid-feedback')
                $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
            }else{
                $('#formLocalEdit #cep').removeClass('is-invalid')
                $('.invalid-feedback').html('')
            }
        }
        
        $.ajax({
            url: "/local/editarPesquisarLocalJson/" + Number.parseInt(e.target.id), 
            type: "GET", 
            success: function (response) {
                // alert(response.data.tempo_execucao_telemetria)
                $('#editarLocalCabecalho').html("Editar Local")
                $("#modaledit").modal("show")
                $("#id").val(e.target.id)
                $("#cep").val(response.data.cep);
                $("#endereco").val(response.data.endereco)
                $("#cidade").val(response.data.cidade)
                $("#bairro").val(response.data.bairro)
                $("#estado").val(response.data.estado)
                $("#obs").val(response.data.obs)

                // $("#nomeUsuario").val(response.data.nomeUsuario)
                
                
                console.log(response.data.nomeUsuario)
                var cont = $.map($("#usuario_id"), function(e) {
                    return (e.length)
                })

                console.log("CONTADOR DE NOME " + cont)
                $.each(response.data.usuariosIdNome, function(i, d){ // i - value | d - texto/informaçao 
                    if(response.data.usuariosIdNome.length == cont){
                        console.log(cont)
                    }else{
                        $('#usuario_id').append($('<option>', { "value" : d[0] }).text(d[1])) // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
                    }
                    console.log("USUARIOS ID"+ i + " d: " + d)
                })

                    $("#usuario_id option").filter(function(){
                        return $(this).text() == response.data.nomeUsuario
                    }).prop("selected", true)
                                  
            },
            error: function(error){
                console.log(error.responseText)
            }
        })
    })

    var url = '/local/editarLocalJson'

    document.addEventListener('keydown', function(e){
        e = e || window.event
        var codigo =  e.key
        console.log("Tecla pressionada eh " + codigo + " traduçao " + String.fromCharCode(codigo))
        $('.invalid-feedback').fadeOut(1600, function() {
            // $('#formConfig #tempoTelemetria').removeClass('is-invalid')
            $('.invalid-feedback').html()
            // $('.is-invalid').html()
            // $('#formAdicionarConfig #tempoTelemetria').removeClass('invalid-feedback')
            $('#formLocalEdit #cep').removeClass('is-invalid')
            $('#formLocalEdit #endereco').removeClass('is-invalid')
            $('#formLocalEdit #bairro').removeClass('is-invalid')
            $('#formLocalEdit #cidade').removeClass('is-invalid')
            $('#formLocalEdit #estado').removeClass('is-invalid')

            $('#formLocalEdit #cep').addClass('is-valid')
            $('#formLocalEdit #endereco').addClass('is-invalid')
            $('#formLocalEdit #bairro').addClass('is-invalid')
            $('#formLocalEdit #cidade').addClass('is-invalid')
            $('#formLocalEdit #estado').addClass('is-invalid')
            
        })
       
    })

    $("#edit_action").click(function(e){
        e.preventDefault();
        

        if($('#formLocalEdit #cep').val() == '' || $('#formLocalEdit #endereco').val() == '' || $('#formLocalEdit #bairro').val() == '' || $('#formLocalEdit #cidade').val() == '' || $('#formLocalEdit #estado').val() == '' ){
            $('#formLocalEdit').addClass('needs-validation')
            $('#formLocalEdit #cep').addClass('is-invalid')
            $('#formLocalEdit #endereco').addClass('is-invalid')
            $('#formLocalEdit #bairro').addClass('is-invalid')
            $('#formLocalEdit #cidade').addClass('is-invalid')
            $('#formLocalEdit #estado').addClass('is-invalid')
            $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
                'class': 'invalid-feedback'
            }).appendTo('#formLocalEdit .form-group');
            //$("#formConfigEdit #tempoTel").addClass('.invalid-feedback')
            $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
        }else{
            $('#formLocalEdit #cep').removeClass('is-invalid')
            $('#formLocalEdit #endereco').removeClass('is-invalid')
            $('#formLocalEdit #bairro').removeClass('is-invalid')
            $('#formLocalEdit #cidade').removeClass('is-invalid')
            $('#formLocalEdit #estado').removeClass('is-invalid')
            $('.invalid-feedback').html()
        

    
      

            var data = {
                id: Number.parseInt($("#formLocalEdit #id").val()),
                cep: ($('#formLocalEdit #cep').val()),
                endereco: ($('#formLocalEdit #endereco').val()),
                bairro: ($('#formLocalEdit #bairro').val()),
                cidade: ($('#formLocalEdit #cidade').val()),
                estado: ($('#formLocalEdit #estado').val()),
                obs: $('#formLocalEdit #obs').val(),
                nomeUsuario: Number.parseInt($('#formLocalEdit #usuario_id').val())
                // usuarioId: Number.parseInt(($('#usuario_id').val()))
            }
            console.log(data)
            console.log(JSON.stringify(data))
    
            $.ajax({
               url: url,  // "https://192.168.0.13:59000/config/registrarConfiguracoes"
               type: "PUT",
               data: JSON.stringify(data),
               dataType: 'json',
               encode: true,
               contentType: "application/json, charset=UTF-8",
               processData: false
            }).done(function(data){
                
                $("#modaledit").modal("hide")
                console.log(data)
                // alert(data)
                $.notify('Sucesso ao atualizar o registro de local', 'success')
                tabelaLocal.ajax.reload()
    
            }).fail(function(data, err, opt){
                console.log('Erro ao atualizar o registro de local'+ data.responseText + err + opt)
                $.notify('Erro ao atualizar o registro de local'+ data + err + opt, 'error')
            })
        }
        
    })
    
    pegaToken($("#formLocalEdit #csrf_token").val())
}

function deletaLocalJson(tabelaLocal){
    $("#myTable").on("click", ".btn-outline-danger", function(evento) {

        var escolha = window.confirm("Deseja realmente deletar esse local?")
        if(escolha){
            $.ajax({
                url: "/local/excluirLocal/" + Number.parseInt(evento.target.id),
                type: 'DELETE',
                success: function(response){
                    $.notify('Sucesso ao deletar o local', 'success')
                    tabelaLocal.ajax.reload()
                },
                error: function(error) {
                    $.notify('Error ao deletar local' + error, 'error')
                }
            })
        }else {
            alert("Local nao foi deletado")
        }
    })

    pegaToken($("#formLocalEdit #csrf_token").val())
}


function insereInfoJson(tabelaInfo){

    $(".btn-outline-success").click(function(){

        $.ajax({
            url: "/informacao/listarInfoJson",
            type: "GET"
        }).done(function(response) {

            var valores = [ $("#formInfoAdicionar #sensores_id option").length, $("#formInfoAdicionar #modulo_id option").length]
            
            $.each(response.dados, function(i, d){ // como o dados esta vindo como um vetor/lista temos que percorre-lo e depois pegar atraves do parametro d os campos do json que queremos i - indice | d - campos do json nesse caso
                console.log("API "+ d.sensores.length)               
               
                if(d.sensores.length == valores[0]){
                    console.log(d.sensores)                    
                }else {
                    $.each(d.sensores, function(i, d){
                        $("#formInfoAdicionar #sensores_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                    })
                }

                // console.log("API "+ d.sensores.length)
                // if(d.local.length == valores[1]){
                //     console.log(d.local)
                // }else{
                //     $.each(d.local, function(i, d){
                //         $("#formInfoAdicionar #local_id").append($('<option>', { "value" : d[0] }).text(d[1]  + " - " + d[2]))
                //     })
                // }
                
                if(d.modulos.length == valores[1]){
                    console.log(d.modulos)                    
                }else{
                    $.each(d.modulos, function(i, d){
                        $("#formInfoAdicionar #modulo_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                    })
                }
                    
            })

        }).fail(function(data, err, opt){
            $("#formInfoAdicionar #local_id").append($('<option>', { "value" : "1" }).text("NENHUM LOCAL REGISTRADO"))
            $("#formInfoAdicionar #modulo_id").append($('<option>', { "value" : "2" }).text("NENHUM MODULO REGISTRADO"))
            $("#formInfoAdicionar #sensores_id").append($('<option>', { "value" : "3" }).text("NENHUM SENSOR REGISTRADO"))
            $("#submit_action")

            document.getElementById("submit_action").setAttribute('disabled', true)
            
            console.log('Erro ao inserir informaçao' + data.response.status + err + opt)
            $.notify('Erro ao inserir informaçao' + data , 'error')
        })
    })

    $("#submit_action").click(function(evento){
        evento.preventDefault()

        if($("#submit_action").attr('disabled', false)){
            var data = {
                id: Number.parseInt($("#formInfoAdicionar #id").val()),
                id_sensores: Number.parseInt($("#formInfoAdicionar #sensores_id").val()),
                id_local: Number.parseInt($("#formInfoAdicionar #local_id").val()),
                id_modulos: Number.parseInt($("#formInfoAdicionar #modulo_id").val())
            }

            console.log(data)
            console.log(JSON.stringify(data))
            var url = "/informacao/insereInfoJson"

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                dataType: 'json',
                encode: true,
                contentType: "application/json, charset=UTF-8",
                processData: false
            }).done(function(response){
                $("#mymodal").modal("hide") 
                console.log(response)
                $.notify('Sucesso ao inserir informaçao', 'success')
                tabelaInfo.ajax.reload()
            }).fail(function(data, err, opt){
                console.log('Erro ao inserir informaçao' + data.responseText + err + opt)
                $.notify('Erro ao inserir informaçao' + data.response.status + err + opt, 'error')
            })
        }
    })
    
    var csrf_token = $("#formInfoAdicionar #csrf_token").val()
    pegaToken(csrf_token) 

}



function editaInfoJson(tabelaInfo){
    console.log("to aqui")
    var tabela = document.querySelector("#myTable")
    var btnEdita = document.querySelectorAll(".btn-outline-warning")

    $('#myTable').on("click", ".btn-outline-warning", function(e) {
    
        $.ajax({
            url: "/informacao/listarInfoJson", //+ Number.parseInt(e.target.id),
            type: "GET",
            success: function(response) {
                // console.log(response.dados)
                $("#editarInfoCabecalho").html("Editar Informaçao")
                $("#modaledit").modal("show")
                $("#formInfoEdit #id").val(e.target.id)
                // alert($("#formInfoEdit #csrf_token").val())
                // console.log(response.dados.sensores)
                var valores = [ $("#formInfoEdit #sensores_id option").length, $("#formInfoEdit #local_id option").length , $("#formInfoEdit #modulo_id option").length ]
             
               

                console.log("VAL " + valores[0])
                $.each(response.dados, function(i, d){ // como o dados esta vindo como um vetor/lista temos que percorre-lo e depois pegar atraves do parametro d os campos do json que queremos i - indice | d - campos do json nesse caso
                    console.log("API "+ d.sensores.length)
                    if(d.sensores.length == valores[0]){
                        console.log(d.sensores)                    
                    }else {
                        $.each(d.sensores, function(i, d){
                            $("#formInfoEdit #sensores_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                        })
                    }

                    // console.log("API "+ d.sensores.length)
                    if(d.local.length == valores[1]){
                       console.log(d.local)
                    }else{
                        $.each(d.local, function(i, d){
                            $("#formInfoEdit #local_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                        })
                    }

                    if(d.modulos.length == valores[2]){
                        console.log(d.modulos)                    
                    }else{
                        $.each(d.modulos, function(i, d){
                            $("#formInfoEdit #modulo_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                        })
                    }
                    
                })
                

                for(lin of response.data) {
                    if(lin.id == Number.parseInt(e.target.id)){                

                        $("#formInfoEdit #sensores_id option").filter(function() {
                            return $(this).text() == lin.nome_sensores
                        }).prop("selected", true)

                        $("#formInfoEdit #local_id option").filter(function() {
                            return $(this).text() == lin.nome_local
                        }).prop("selected", true)

                        $("#formInfoEdit #modulo_id option").filter(function() {
                            return $(this).text() == lin.nome_modulos
                        }).prop("selected", true)

                    }
                }
            },
            error: function(error){
                console.log(error.responseText)
            }


        })
    })

    var url = "/informacao/editarInformacaoJson"

    $("#edit_action").click(function(evento) {

        evento.preventDefault();

        var data = {
            id: Number.parseInt($("#formInfoEdit #id").val()),
            id_sensores: Number.parseInt($("#formInfoEdit #sensores_id").val()),
            id_local: Number.parseInt($("#formInfoEdit #local_id").val()),
            id_modulos: Number.parseInt($("#formInfoEdit #modulo_id").val())
        }

        console.log(data)
        console.log(JSON.stringify(data))

        $.ajax({
            url: url,
            type: "PUT",
            data: JSON.stringify(data),
            dataType: 'json',
            encode: true,
            contentType: "application/json, charset=UTF-8",
            processData: false
        }).done(function(response){
            $("#modaledit").modal("hide") 
            console.log(response)
            $.notify('Sucesso ao atualizar informaçao', 'success')
            tabelaInfo.ajax.reload()
        }).fail(function(data, err, opt){
            console.log('Erro ao atualizar informaçao' + data.responseText + err + opt)
            // $.notify('Erro ao atualizar informaçao' + data.responseText + err + opt, 'error')
        })
    })
    
    var csrf_token = $("#formInfoEdit #csrf_token").val()
    pegaToken(csrf_token) 

}

function deletaInfoJson(tabelaInfo){
    $("#myTable").on('click', '.btn-outline-danger', function(evento){

        var escolha = window.confirm("Deseja realmente deletar essa informaçao?")
        if(escolha){
            $.ajax({
                url: '/informacao/excluirInformacaoJson/' + Number.parseInt(evento.target.id),
                type: 'DELETE',
                success: function(response){
                    $.notify('Sucesso ao deletar informaçao', 'success')
                    tabelaInfo.ajax.reload()
                },
                error: function(error){
                    $.notify('Error ao deletar informaçao ' + error, 'error')
                }
            })
        }else{
            alert('Informaçao nao foi deletada!!!')
        }

    })

    var csrf_token = $("#formInfoEdit #csrf_token").val()
    pegaToken(csrf_token) 

}


function insereSensorJson(tabelaSensores){

    $(".btn-outline-success").click(function() {

        $("#adicionarSensorCabecalho").html("Adicionar Sensor")
    })

    

    $("#submit_action").click(function(event){
        event.preventDefault()

        $("adicionarSensorCabecalho").html("Adicionar Sensor")

        var data = {
           tipoSensor: $("#formSensorInsere #tipoSensor").val(),
           descritivo: $("#formSensorInsere #descritivo").val()
        }

        if(data.tipoSensor == '' || data.descritivo == ''){
            if(data.tipoSensor == '' || data.descritivo){
                $("#formSensorInsere").addClass('needs-validation')
                $("#formSensorInsere #tipoSensor").addClass('is-invalid')
                $("#formSensorInsere #descritivo").addClass('is-invalid')
                $('<div/>', {   // criando o elemento html div dentro do <div class='form-group' e incluindo a classe invalid-feedback
                    'class': 'invalid-feedback'
                }).appendTo('#formSensorInsere .form-group');
                //$("#formConfigEdit #tempoTel").addClass('.invalid-feedback')
                $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
            }else{
                $("#formSensorInsere #tipoSensor").removeClass('is-invalid')
                $("#formSensorInsere #descritivo").removeClass('is-invalid')
                $('.invalid-feedback').html('')
            }

        }else {

        var url = "/sensor/registraSensoresJson"
        
            $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(data),
            dataType: 'json',
            encode: true,
            contentType: "application/json, charset=UTF-8",
            processData: false
            }).done(function(response){
                $("#mymodal").modal("hide")
                $.notify("Sucesso ao inserir sensor", 'success')
                tabelaSensores.ajax.reload()
            }).fail(function(data, err, opt){
                console.log("Erro ao inserir o sensor" + data.responseText + err + opt)
                $.notify("Erro ao inserir informaçao" + data.responseText, "error")
            })
        }
    })

    var csrf_token = $("#formSensorInsere #csrf_token").val()
    pegaToken(csrf_token)
}

function editaSensorJson(tabelaSensores){

    var tabela = document.querySelector("#myTable")
    var btnEdita = document.querySelectorAll(".btn-outline-warning")

    $("#myTable").on("click", ".btn-outline-warning", function(event){

        $.ajax({
            url: "/sensor/editarPesquisarSensorJson/" + Number.parseInt(event.target.id),
            type: "GET",
            success: function (response) {
                $("#modaledit").modal("show")
                $("#editarSensoresCabecalho").html("Editar Sensor")
                $("#formSensoresEdit #id").val(event.target.id)
                $("#formSensoresEdit #tipoSensor").val(response.data.tipoSensor)
                $("#formSensoresEdit #descritivo").val(response.data.descritivo)
                
            },
            error: function(error){
                console.log(error.responseText)
            }
        })

        var url = "/sensor/editarSensoresJson"

        $("#edit_action").click( function(evento) {
            evento.preventDefault()

            var data = {
                id: Number.parseInt($("#formSensoresEdit #id").val()),
                tipoSensor: $("#formSensoresEdit #tipoSensor").val(),
                descritivo: $("#formSensoresEdit #descritivo").val()
            }

            console.log(JSON.stringify(data))

            $.ajax({
                url: url,
                type: "PUT",
                data: JSON.stringify(data),
                dataType: "json",
                encode: true,
                contentType: "application/json, charset=UTF-8",
                processData: false
            }).done(function(data){
                $("#formSensoresEdit #tipoSensor").val(),
                $("#formSensoresEdit #descritivio").val(),

                $("#modaledit").modal("hide")
                console.log(data)
                $.notify("Sucesso ao atualizar o regisitro de sensores", "success")
                tabelaSensores.ajax.reload()
            }).fail(function(data, err, opt){
                console.log("Erro ao atualizar o registro de sensores" + data.responseText + err + opt)
                $.notify("Erro ao atualizar o registro de sensores" + data + err + opt, 'error')
            })
        })
    })

    pegaToken($("#formSensoresEdit #csrf_token").val())
}

function deletaSensorJson(tabelaSensores){
    $("#myTable").on("click", ".btn-outline-danger", function(evento) {

        var escolha = window.confirm("Deseka realmente deletar esse sensor?")
        if(escolha){
            $.ajax({
                url: "/sensor/excluirSensor/" + Number.parseInt(evento.target.id),
                type: "DELETE",
                success: function(response){
                    $.notify("Sucesso ao deletar sensor", 'success')
                    tabelaSensores.ajax.reload()
                },
                error: function(error){
                    $.notify('Error ao deletar sensor' + error, 'error')
                }
            })
        }else {
            alert("Sensor nao foi deletado!!!")
        }
    })

    var csrf_token = $("#formSensoresEdit #csrf_token").val()
    pegaToken(csrf_token)
}

function meuMapa(){

        var idElemento = document.querySelectorAll(".btn-outline-info")
        let idModal;
        console.log(idElemento)
        for(var i = 0; i < idElemento.length; i++){
            idElemento[i].addEventListener('click', function(e){
                // alert("Elemento clicado foi o " + e.target.id)
                // alert(e.target.id)
                console.log(e.target)
               
                idModal = e.target.id;
                // console.log(e.target.getAttribute('data-lat'))
                // console.log(e.target.getAttribute('data-long'))
                var lat = parseFloat(e.target.getAttribute('data-lat'))
                var long = parseFloat(e.target.getAttribute('data-long'))
                console.log(lat)
                // console.log(idModal.split('btnMapa')[1])
                var latLong = new google.maps.LatLng(lat, long)
                // var latLong = new google.maps.LatLng(-22.75917, -43.45111)  // Nova Iguaçu
                var mapaProp = {
                    center: latLong,
                    // center: {lat: lat, lng: long},
                    //   center: new google.maps.LatLng(minhaPosicao, idMapa),
                    zoom: 14,
                    mapTypeId: 'hybrid', //  terrain  roadmap
                    scaleControl: true,
                    draggableCursor: 'default',
                    fullscreenControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                    },
                };

                var map = new google.maps.Map(
                    document.getElementById("googleMap"+idModal.split('btnMapa')[1])    
                , mapaProp);
                
                var marker = new google.maps.Marker({
                        position: latLong,
                        map: map,
                        title: 'teste JS Pointer',
                });
                
            });
            
        }
        console.log(idModal)
}


function googleMapa() {
    $("#myTable").on('click', ".btn-outline-info", function(e) {
        $("#modal-edit").modal('show')
        $("#editarGeoCabecalho").html("Mapa")
        
        
        let idModal;
        console.log(e.target)
            
        idModal = e.target.id;
        var lat = parseFloat(e.target.getAttribute('data-lat'))
        var long = parseFloat(e.target.getAttribute('data-long'))
        console.log(lat)
        var latLong = new google.maps.LatLng(lat, long)
        var mapaProp = {
            center: latLong,
            zoom: 14,
            mapTypeId: 'terrain', //hybrid    roadmap
            scaleControl: true,
            draggableCursor: 'default',
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
        };

        $('.modal-body').attr('id', 'googleMap'+idModal)
        // alert($('.modal-body').attr('id'))

        var map = new google.maps.Map(
            document.getElementById($('.modal-body').attr('id'))    
        , mapaProp);
            
        var marker = new google.maps.Marker({
                position: latLong,
                map: map,
                title: 'teste JS Pointer',
        });
        
        console.log(idModal)

       
    })

}



function testeAlteraData(){
    
    if(document.querySelectorAll(".jumbotron")[0] != null){
        if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Telemetria"){
            
            // var tabela = $(".table").find("tbody");
            var novaData = null;

            var tabela2 = $('#myTable').DataTable({
                ajax: {
                    url: "/telemetria/listarTelemetriaJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                 
                },
                columns: [
                    {"data": "id"},
                    {"data": "NOME"}, //render: function(data){
                      
                    {"data": "SENSORG", render: function(data){
                        return `${data} PPM`;
                    }},
                    {"data": "SENSORT", render: function(data){
                        return `${parseFloat(data).toFixed(1)} °C`;
                    }},
                    {"data": "SENSORU", render: function(data){
                        return `${data} %`;
                    }},
                    {"data": "dataCriacao", render: function(data){
                        novaData = new Date(data);
                        // dataFormatada = new Date(novaData.valueOf() - novaData.getTimezoneOffset() * 60000);
                        // novaData.toISOString();
                        return  novaData.getUTCDate().toString().padStart(2, '0') + "/" + (novaData.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaData.getUTCFullYear() + " " + novaData.getUTCHours().toString().padStart(2, '0') + ":" + novaData.getUTCMinutes().toString().padStart(2, '0') + ":" + novaData.getUTCSeconds().toString().padStart(2, '0')
                        // return dataFormatada[0]
                        // return novaData.toLocaleString('pt-BR', {timeZone: 'GMT'})  // new Intl.DateTimeFormat('pt-BR', {dataStyle: 'short', timeStyle: 'short'}).format(new Date(data));  novaData.toLocaleString('pt-BR', {timeZone: 'GMT'})
                        }
                    }
                  
                ], 
                "order": [0, 'desc'],           
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true,
                deferRender: true
            });

            // tabela2.buttons().container().appendTo("#myTable_wrapper .col-md-6:eq(0)")

            // tabela2.buttons.info('TESTANDO', 3000);
            setInterval(function(){
                tabela2.ajax.reload();  
            }, 30000); // 3 min
            
        
        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Usuarios"){
            

            var tabelaUsuarios = $("#myTable").DataTable({
                ajax: {
                    url: "/form/listarUsuariosJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                }, 
                columns: [
                    {"data": "id"},
                    {"data": "nome"},
                    {"data": "email"},
                    // {"data": "dataCriacao", render: function(data){
                    //     novaDataSensor = new Date(data)
                    //     return novaDataSensor.getUTCDate().toString().padStart(2, '0') + "/" + (novaDataSensor.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaDataSensor.getFullYear().toString() + " " + novaDataSensor.getUTCHours().toString().padStart(2, '0') + ":" + novaDataSensor.getUTCMinutes().toString().padStart(2, '0') + ":" + novaDataSensor.getUTCSeconds().toString().padStart(2, '0')
                    //     }
                    // },
                    {"data": "sexo"},
                    // {"data": "cpf"},
                    {"data": "tel"},
                    {"data": "idade"},
                    {"data": "dataNasc", render: function(data){
                        novaDataSensor = new Date(data)
                        return novaDataSensor.getUTCDate().toString().padStart(2, '0') + "/" + (novaDataSensor.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaDataSensor.getFullYear().toString() 
                        }
                    },                    
                    {"data": "tipoUsuario", render: function(data){
                        if (data == 1){
                            return 'ADMIN'
                        }else{
                            return 'COMUM'
                        }
                    }
                    },
                    {
                        "data": null,
                        render: function(data, type, full_row, meta){
                            return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-pencil-square"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
                            '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>' +
                            '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
                            '</svg> Editar </button>' +

                            ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-trash"></i> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                            '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
                            '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
                            '</svg> Excluir </button>';                      
                            
                        }
                    }
                ],
                "order": [0, 'desc'],
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true,
                // dom: 'Bftrip',
                colReorder: true,
                // buttons: [
                //     {
                //         text: 'Visibilidade de Colunas',
                //         extend: 'colvis',
                //         collectionLayout: 'fixed two-column'
                //     }
                // ]
            });

            setInterval(function(){
                tabelaUsuarios.ajax.reload()
            }, 30000);

            editaUsuarios(tabelaUsuarios)
            deletaUsuarios(tabelaUsuarios)

        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Local"){
            
            var tabelaLocal = $("#myTable").DataTable({
                ajax: {
                    url: "/local/listarLocalJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                }, 
                columns: [
                    {"data": "id"},
                    {"data": "cep"},
                    {"data": "endereco"},
                    {"data": "cidade"},
                    {"data": "bairro"},
                    {"data": "estado"},
                    {"data": "obs"},
                    {"data": "nomeUsuario"},
                    {
                        "data": null,
                        render: function(data, type, full_row, meta){
                            return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-pencil-square"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
                            '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>' +
                            '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
                            '</svg> Editar </button>' +

                            ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-trash"></i> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                            '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
                            '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
                            '</svg> Excluir </button>';                      
                            
                        }
                    }
                   
                ],
                "order": [0, 'desc'],
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true
            });

            setInterval(function(){
                tabelaLocal.ajax.reload()
            }, 3000);

            insereLocalJson(tabelaLocal)
            editaLocalJson(tabelaLocal)
            deletaLocalJson(tabelaLocal)


        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Sensores"){
            var tabelaSensores = $("#myTable").DataTable({
                ajax: {
                    url: "/sensor/listarSensorJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                }, 
                columns: [
                    {"data": "id"},
                    {"data": "nome"},
                    {"data": "descritivo"},
                    {"data": "dataCriacao", render: function(data){
                        novaDataSensor = new Date(data)
                        return novaDataSensor.getUTCDate().toString().padStart(2, '0') + "/" + (novaDataSensor.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaDataSensor.getFullYear().toString() + " " + novaDataSensor.getUTCHours().toString().padStart(2, '0') + ":" + novaDataSensor.getUTCMinutes().toString().padStart(2, '0') + ":" + novaDataSensor.getUTCSeconds().toString().padStart(2, '0')
                        }
                    },
                    {
                        "data": null,
                        render: function(data, type, full_row, meta){
                             return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-pencil-square"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
                            '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>' +
                            '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
                            '</svg> Editar </button>' +
                            
                            ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-trash"></i> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                            '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
                            '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
                            '</svg> Excluir </button>';    
                        }
                    }
                    
                ],
                "order": [0, "desc"],
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true

            });

            insereSensorJson(tabelaSensores);
            editaSensorJson(tabelaSensores);
            deletaSensorJson(tabelaSensores);
            
        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Modulos"){
            var novaDataModulos = null;

            var tabelaModulos = $("#myTable").DataTable({
                ajax: {
                    url: "/modulo/listarModuloJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    },
                },
                    columns: [
                        {"data": "id"},
                        {"data": "MAC"},
                        {"data": "NOME"},
                        {"data": "IP_INTERNO"},
                        {"data": "query"},
                        {"data": "region"},
                        {"data": "city"},
                       
                        {"data": "dataCriacao", render: function(data){
                            novaDataModulos = new Date(data);

                            return novaDataModulos.getUTCDate().toString().padStart(2, '0') + "/" + (novaDataModulos.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaDataModulos.getFullYear().toString() + " " + novaDataModulos.getUTCHours().toString().padStart(2, '0') + ":" + novaDataModulos.getUTCMinutes().toString().padStart(2, '0') + ":" + novaDataModulos.getUTCSeconds().toString().padStart(2, '0')
                            // return dataFormatada[2]
                            }
                        },
                        {"data": "dataAlteracao", render: function(data){
                            novaDataInfo = new Date(data)

                            return novaDataInfo.getUTCDate().toString().padStart(2, '0') + "/" + (novaDataInfo.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaDataInfo.getUTCFullYear().toString() + " " + novaDataInfo.getUTCHours().toString().padStart(2, '0') + ":" + novaDataInfo.getUTCMinutes().toString().padStart(2, '0') + ":" + novaDataInfo.getUTCSeconds().toString().padStart(2, '0')
                        }}
                    ],
                    "order": [0, 'desc'],
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true,
                deferRender: true
            });

            // setInterval(function(){
            //     tabelaModulos.ajax.reload();
            // }, 30000);


        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Informacao"){
                var novaDataInfo = null;

                var tabelaInfo = $("#myTable").DataTable({
                    ajax: {
                        url: "/informacao/listarInfoJson",
                        error: function(data, err, opt){
                            $.notify(`Error ao listar informação | Mensagem: ${data.response.status} Tipo Erro: ${err} ${opt}`, 'error')
                            console.log(`Error ao listar informação | Mensagem: ${data.response.status} Tipo Erro: ${err} Código Erro: ${opt}`)
                        },
                        type: "GET",
                        xhrFields: {
                            withCredentials: true
                        }
                    },
                    columns: [
                        {"data": "id"},
                        {"data": "nome_local_usuarios"},
                        {"data": "nome_sensores"},
                        {"data": "nome_modulos"},
                        {"data": "nome_local"},
                        {"data": "dataCriacao", render: function(data){
                            novaDataInfo = new Date(data)

                            return novaDataInfo.getUTCDate().toString().padStart(2, '0') + "/" + (novaDataInfo.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaDataInfo.getUTCFullYear().toString() + " " + novaDataInfo.getUTCHours().toString().padStart(2, '0') + ":" + novaDataInfo.getUTCMinutes().toString().padStart(2, '0') + ":" + novaDataInfo.getUTCSeconds().toString().padStart(2, '0')
                        }},
                        {
                            "data": null,
                            render: function(data, type, full_row, meta){
                                return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-pencil-square"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
                                '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>' +
                                '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
                                '</svg> Editar </button>' +
                                
                                ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-trash"></i> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                                '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
                                '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
                                '</svg> Excluir </button>';    
                            }
                        }
                    ],
                    // 'columnsDefs': [{
                    //     'targets': 0,
                    //     'createdCell': function(td, cellData, rowData, row, col){
                    //         // $(td).addId()
                    //         $(td).attr('id')
                    //     }
                    // }],
                    "order": [0, 'desc'],
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                    },
                    retrieve: true,
                    paging: true,
                    responsive: true
                })

                insereInfoJson(tabelaInfo)
                editaInfoJson(tabelaInfo)
                deletaInfoJson(tabelaInfo)
               


        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Configuracao"){
            
            var dataNovaConfig = null;
            // $('.dt-button').text('Visibilidade de Coluna');
            // $('.dt-button').addClass('dropdown');
           

            var tabelaConfig = $("#myTable").DataTable({
                ajax: {
                    url: "/config/listarConfigJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                },
                columns: [
                    {"data": "id"},
                    {"data": "tempo_execucao_telemetria", render: function(data){
                        return `${data} min`;
                        }
                    },
                    {"data": "tempo_execucao_geolocalizacao", render: function(data){
                        return `${data} min`;
                        }
                    },
                    {"data": "tempo_execucao_soneca", render: function(data){
                        return `${data} min`;
                        }
                    },
                    {"data": "tempo_execucao_thingspeak", render: function(data){
                        return `${data} min`;
                        }
                    },
                    {"data": "url_ip_api", "visible": false},
                    {"data": "url_thingspeak", "visible": false},
                    {"data": "secret_key_thingspeak", "visible": false},
                    {"data": "token_telegram", "visible": false},
                    {"data": "resetar_configs_wifi", render: function(data){
                            if (data == 0){
                                return 'NAO'
                            }else{
                                return 'SIM'
                            }
                        }
                    },
                    {"data": "alerta_email", render: function(data, type, row){
                            var cont = 0
                            var status = document.querySelectorAll('.custom-control-input')
                            if (data == 0){ 
                                // return '<div class="custom-control custom-switch"> <input data="'+ row.id +'" type="checkbox" class="custom-control-input">  <label class="custom-control-label"></label> </div>'
                                return 'NAO'
                            }else{
                                // status.checked = true
                                // return '<div class="custom-control custom-switch"> <input data="'+ row.id +'" type="checkbox" class="custom-control-input" checked>  <label class="custom-control-label" for="customSwitch1"></label> </div>'
                                return 'SIM'
                            }
                        }
                    },
                    {"data": "valor_gas_aviso", "visible": true},
                    {"data": "dataCriacao", render: function(data){
                        dataNovaConfig = new Date(data);

                        return dataNovaConfig.getUTCDate().toString().padStart(2, '0') + "/" + (dataNovaConfig.getUTCMonth()+1).toString().padStart(2, "0") + "/" + dataNovaConfig.getUTCFullYear() + " " + dataNovaConfig.getUTCHours().toString().padStart(2, "0") + ":" + dataNovaConfig.getUTCMinutes().toString().padStart(2, "0") + ":" + dataNovaConfig.getUTCSeconds().toString().padStart(2, "0")
                        // return dataFormatada[dataFormatada.length - 1]
                    }

                    },
    
                    {"data": "dataAtualizacao", "visible": false, render: function(data) {
                        var formataData = new Date(data);
                        return formataData.getUTCDate().toString().padStart(2, '0') + "/" + (formataData.getUTCMonth()+1).toString().padStart(2, "0") + "/" + formataData.getUTCFullYear() + " " + formataData.getUTCHours().toString().padStart(2, "0") + ":" + formataData.getUTCMinutes().toString().padStart(2, "0") + ":" + formataData.getUTCSeconds().toString().padStart(2, "0")
                    }},
    
                    {"data": "nomeUsuario", "visible": false},
                    {
                        "data": null,
                        render: function(data, type, full_row, meta){
                            return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-pencil-square"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
                            '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>' +
                            '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
                            '</svg> Editar </button>' +
                            
                            ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-trash"></i> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                            '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
                            '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
                            '</svg> Excluir </button>';    
                        }


                    } 
                ],
                "order": [0, 'desc'],
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true,
                dom: 'Bftrip',
                colReorder: true,
                buttons: [
                    {
                        text: 'Visibilidade de Colunas',
                        extend: 'colvis',
                        collectionLayout: 'fixed two-column'
                    }
                ]
            });

            // tabelaConfig.order([0, 'desc']).draw();  // ordenar tabela via coluna nesse caso eh a primeira coluna

            setInterval(function(){
                tabelaConfig.ajax.reload();
            }, 30000);
            // chamaTabelaEstatica();
            
            insereConfigJson(tabelaConfig);
            editaConfigJson(tabelaConfig);
            deletarConfigJson(tabelaConfig);


        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Geolocalizacao"){
            // chamaTabelaEstatica();
            googleMapa()

            var dataNovaGeo = null;

            var tabelaGeo = $("#myTable").DataTable({
                ajax:{
                    url: "/geo/listarGeoJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                },
                columns: [
                    {"data": 'id'},
                    {"data": 'dataCriacao', render: function(data){
                        dataNovaGeo = new Date(data);

                        return dataNovaGeo.getUTCDate().toString().padStart(2, '0') + "/" + (dataNovaGeo.getUTCMonth()+1).toString().padStart(2, '0') + "/" + dataNovaGeo.getUTCFullYear() + " " + dataNovaGeo.getUTCHours().toString().padStart(2, '0') + ":" + dataNovaGeo.getUTCMinutes().toString().padStart(2, '0') + ":" + dataNovaGeo.getUTCSeconds().toString().padStart(2, '0')
                    }},
                    {"data": 'query'},
                    {"data": 'status'},
                    {"data": 'region'},
                    {"data": 'city'},
                    {"data": 'zip'},
                    {"data": 'lat'},
                    {"data": 'long'},
                    {"data": 'NOME'},
                    {
                        "data": null,
                        render: function (data, type, full_row, meta){
                            return '<button type="button" class="btn btn-outline-info btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" data-lat="'+ full_row.lat +'" data-long="'+ full_row.long +'" id="'+ full_row.id +'" ><i class="bi bi-eye"></i> Visualizar </button>'
                        
                        }
                    }

                   
                ],
                "order": [0, 'desc'],
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                },
                retrieve: true,
                paging: true,
                responsive: true
            });

            setInterval(function () {
                tabelaGeo.ajax.reload();
            }, 30000);
        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Tipo Usuario"){
            var dataNovoTipo = null;

            var tabelaTipoUsuario = $("#myTable").DataTable({
                ajax: {
                    url: "/tipo_usuario/listarTipoUsuarioJson",
                    type: "GET",
                    xhrFields: {
                        withCredentials: true
                    }
                },
                columns: [
                    {"data": "id"},
                    {"data": "tipoUsuario"},
                    {"data": "dataCriacao", render: function(data){
                        dataNovoTipo = new Date(data)

                        return dataNovoTipo.getUTCDate().toString().padStart(2, '0') + "/" + (dataNovoTipo.getUTCMonth()+1).toString().padStart(2, "0") + "/" + dataNovoTipo.getUTCFullYear() + " " + dataNovoTipo.getUTCHours().toString().padStart(2, "0") + ":" + dataNovoTipo.getUTCMinutes().toString().padStart(2, "0") + ":" + dataNovoTipo.getUTCSeconds().toString().padStart(2, "0")
                        }
                    },
                    {"data": "dataAtualizacao", render: function(data){
                        let formataData = new Date(data)

                        return formataData.getUTCDate().toString().padStart(2, '0') + "/" + (formataData.getUTCMonth()+1).toString().padStart(2, "0") + "/" + formataData.getUTCFullYear() + " " + formataData.getUTCHours().toString().padStart(2, "0") + ":" + formataData.getUTCMinutes().toString().padStart(2, "0") + ":" + formataData.getUTCSeconds().toString().padStart(2, "0")
                        }
                    },
                    {
                        "data": null,
                        render: function(data, type, full_row, meta){
                            return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-pencil-square"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
                            '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>' +
                            '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
                            '</svg> Editar </button>' //+
                            
                            // ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"> <i class="bi bi-trash"></i> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                            // '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
                            // '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
                            // '</svg> Excluir </button>';    
                        }
                    }
                ],
                "order": [0, 'desc'],
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
                    },
                retrieve: true,
                paging: true,
                responsive: true
            })

            setInterval(function() {
                tabelaTipoUsuario.ajax.reload()
            }, 3000)

            
        }

        // }
        
        notificaVazamento();
    }
}


// function notificaVazamentoDesktop(titulo, valor){
//     Notification.requestPermission(permission => {
//         if(permission === 'granted'){
//             criaNotificaoDesktop(titulo, valor, "/static/bootstrap-4.5.0-dist/images/vazamento.png")
//         }
//     })    
// }


function criaNotificaoDesktop(titulo, texto) {
    let temPermissao = window.Notification.permission()
    if(temPermissao === "granted") {
        let notificacao = new Notification("Ola teste Notificacao JS")
    }else if (temPermissao !== 'denied') {
        Notification.requestPermission(permission => {
            if(permission === 'granted'){
                let notificacao = new Notification("Ola teste Notificacao JS")
            }
        })    
    }
    
    
    // Notification.on('new', () => {
    //     if(permission === 'granted'){
    //         const notification = new Notification(titulo, {
    //             body: texto
    //             //icon: "/static/bootstrap-4.5.0-dist/images/vazamento.png"
    //         })

    //         notification.onclick = (e) => {
    //             e.preventDefault()
    //             window.focus()
    //             notification.close()
    //         }
    //     }
    // })
}

function mostraAlerta(obj){
    var html = 
                '<div class="col-md-4 float-md-right fixed-top" id="alerta">' +
                    '<div class="border border-'+ obj.class + ' alert alert-' + obj.class + ' alert-dismissible" role="alert">'+
                        '<strong>' + obj.message + '</strong>' +
                        '   <button class="close" type="button" data-dismiss="alert"> ' +
                        '       <span aria-hidden="true">x</span>' +
                        '   </button>'
                    ' </div>'
                ' </div>';
          


        $('body').append(html)
        window.setInterval(function(){
            if($('.alert').is(".alert-danger")){
                $(".alert").fadeTo(500, 0).slideUp(500,
                    function(){
                        $(this).remove();
                    });
            }
        }, 8000)

        window.setTimeout(function(){
            $("#alerta").remove()
        }, 22000)

        // $('#navbarNav')
        // $('.alert').hide().show('medium')
}


window.setInterval(function(){
    if($('.alert').is(".alert-danger")){
        $(".alert").fadeTo(500, 0).slideUp(500,
            function(){
                $(this).remove();
            });
    }
}, 10000)

function notificaVazamento(){

    // var url = "/telemetria/listarTelemetriaJson"
    var urlConfig = "/config/listarConfigJson"
    var nomeUsuarioLogado = document.querySelectorAll('.nav-link')[8].text.split(': ')[1]
    var id = document.querySelectorAll('.navbar-nav')[1].querySelectorAll('.nav-item')[0].querySelectorAll('.nav-link')[0].id
    var idUsuarioLogado = parseInt(id.split("_")[0])
    var tipoUsuario = parseInt(id.split("_")[1]) 
    var valorGas;


    window.setInterval(function() {

        // if($('.alert').is(".alert-danger")){
        //     $(".alert").fadeTo(500, 0).slideUp(500,
        //         function(){
        //             $(this).remove();
        //         });
        // }


        $.ajax({
            url: urlConfig,
            type: "GET",
            success: function(response){
                // console.log(response.data[0].usuario_id)
                // if(length(response) == 1){
                    // if(response.data[0].id == idUsuarioLogado){
                    //     valorGas = response.data[0].valor_gas_aviso
                    //     // alert(valorGas)
                    // }
                // }
                
                    for(let x of response.data){
                            // console.log(x)
                        console.log(x.usuario_id, typeof(x.usuario_id))
                        if(x.tipoUsuario == tipoUsuario){

                            if(x.usuario_id == idUsuarioLogado){
                                valorGas = parseFloat(x.valor_gas_aviso)
                                    // alert(valorGas)
                            
                    
                        // valorGas.data[""]

                        // let ultimoValor = response
                        // console.log(ultimoValor.data.length)
                        // console.log(ultimoValor.data[0].usuarioTelemetria)
                        // console.log(ultimoValor.data[ultimoValor.data.length - 1])
                        
                        // console.log(ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1] )

                            if(parseFloat(x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["SENSORG"]) >= valorGas){
                                // alert("URGENTE VERIFICAR POSSIVEL VAZAMENTO DE GAS!!!")
                                // $(".alert").removeClass('hidden')
                                // $(".alert").addClass('show')
                                // $('.alert').remove
                                // mostraAlerta({message: `Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`, class: 'danger'})
                            
                                // var indiceLinguagem = null;
                                // var synth = window.speechSynthesis;
                                // console.log(synth)
                                // var voz = synth.getVoices();
                                // console.log(voz)
                                // for(var i = 0; i < voz.length; i++){
                                //     var option = document.createElement('option')
                                //     option.textContent = voz[i].name + ' (' + voz[i].lang + ')'
                                //     option.value = i
                                //     if(option.text ==  "Spanish (Latin America)"){// "Portuguese (Brazil) (pt-BR)"){
                                //         indiceLinguagem = option.value
                                //         console.log("AQUI: "+indiceLinguagem, option.innerText)
                                //     }
                                //     console.log(option)
                                // }
                                
                                // var utterThis = new SpeechSynthesisUtterance(`Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`)
                                // utterThis.voice = voz[indiceLinguagem]
                                // synth.speak(utterThis)
                            
                                // $.notify.addStyle('imagemNotifica', {
                                //     html:
                                //     "<div>"
                                //     + "<span> <img class='imagemNotifica'> <span data-notify-text/></span>"
                                //     + "</div>",
                                //     classes: {
                                //         superblue: {
                                //           "color": "white",
                                //           "background-color": "red",
                                //           "background-image": "url('/static/bootstrap-4.5.0-dist/images/vazamento.png')",
                                //           "object-fit": "scale-down"
                                //         }
                                //       }
                                // })

                                // $.notify("Possivel vazamento de gas", {
                                //     style: "imagemNotifica",
                                //     className: 'superblue'
                                //     // title:'<h4>Possivel vazamento de gas </h4>',
                                //     // icon: '/static/bootstrap-4.5.0-dist/images/vazamento.png'
                                // })
                            
                                $.notify(`Possivel vazamento de gas ${x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["SENSORG"]} | ${x.usuarioTelemetria[x.usuarioTelemetria.length - 1]['NOME']}`, 'error')
                            

                                // var indiceLinguagem = null;
                                // var synth = window.speechSynthesis;
                                // console.log(synth)
                                // var voz = synth.getVoices();
                                // console.log(voz)
                                // var utterThis = new SpeechSynthesisUtterance(`Possivel vazamento de gas ${ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1]["SENSORG"]} | ${ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1]['NOME']}`)

                                // for(var i = 0; i < voz.length; i++){
                                //     var option = document.createElement('option')
                                //     option.textContent = voz[i].name + ' (' + voz[i].lang + ')'
                                //     option.value = i
                                //     // if(option.text ==  "Spanish (Latin America)"){// "Portuguese (Brazil) (pt-BR)"){
                                //     //     indiceLinguagem = option.value
                                //     //     console.log("AQUI: "+indiceLinguagem, option.innerText)
                                //     // }
                                    
                                //     // if(option.text ===  "Google português do Brasil (pt-BR)"){// "Portuguese (Brazil) (pt-BR)"){
                                //     //     indiceLinguagem = option.value
                                //     //     console.log("AQUI: "+indiceLinguagem, option.innerText)
                                //     // }

                                //     if(voz[i].name === "Google US English") {
                                //         utterThis.voice = voz[i]
                                //         utterThis.volume = 5
                                //     }
                                //     console.log(option)
                                //     // console.log(option.text)
                                // }
                                
                            
                                // // utterThis.voice = voz[indiceLinguagem]

                                // // utterThis.lang = voz[indiceLinguagem]

                                // synth.speak(utterThis)
                                // criaNotificaoDesktop("Vazamento", ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1]["SENSORG"])
                            }
                        }
                    } else if(x.tipoUsuario == tipoUsuario){

                            if(x.usuario_id == idUsuarioLogado){
                            // if(response.data[0].tipoUsuario == 2){
                            // let valorGasGeral = {valor_gas_aviso: null, sensor_gas: null, nome_usuario: null}
                            // let listaObj = []
                            // for(let x of response.data){
                                // console.log(`VALOR GAS AVISO: ${i.valor_gas_aviso} | TELEMETRIA: ${i.sensor_gas} | NOME USUARIO TELEMETRIA: ${i.nome_usuario} `)
                                if(parseFloat(x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["SENSORG"]) >= parseFloat(x.valor_gas_aviso)){
                                    $.notify(`Possivel vazamento de gas ${x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["SENSORG"]} | ${x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["NOME"]}`, 'error')
                                }
                                // console.log(x)
                                console.log(x.usuario_id, typeof(x.usuario_id), x.usuarioTelemetria[x.usuarioTelemetria.length - 1])
                                // valorGasGeral.valor_gas_aviso = x.valor_gas_aviso
                                // valorGasGeral.sensor_gas = x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["SENSORG"]
                                // valorGasGeral.nome_usuario = x.usuarioTelemetria[x.usuarioTelemetria.length - 1]["NOME"] 
                                // listaObj.push(valorGasGeral)
                                
                                // valorGasGeral.add(  )
                            // }
                            // console.log(listaObj[0], listaObj[1])
                            // console.log("\n ============================ \n")
                            // for(let i of listaObj){
                            //     console.log(`VALOR GAS AVISO: ${i.valor_gas_aviso} | TELEMETRIA: ${i.sensor_gas} | NOME USUARIO TELEMETRIA: ${i.nome_usuario} `)
                            //     if(i.valor_gas_aviso > i.sensor_gas){
                            //         $.notify(`Possivel vazamento de gas ${i.sensor_gas} | ${i.nome_usuario}`, 'error')
                            //     }
                            // }
                            
                            // console.log(`VALOR GAS AVISO: ${valor_gas_aviso} | TELEMETRIA: ${sensor_gas} | NOME USUARIO TELEMETRIA: ${nome_usuario} `)
                            // if(valor_gas_aviso > sensor_gas){
                            //     $.notify(`Possivel vazamento de gas ${sensor_gas} | ${nome_usuario}`, 'error')
                            // }


                            // valorGas.data[""]

                            // let ultimoValor = response
                            // console.log(ultimoValor.data.length)
                            // console.log(ultimoValor.data[0].usuarioTelemetria)
                            // console.log(ultimoValor.data[ultimoValor.data.length - 1])
                            
                            // console.log( ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1] )

                            // if(ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1]["SENSORG"] < valorGas){
                                // alert("URGENTE VERIFICAR POSSIVEL VAZAMENTO DE GAS!!!")
                                // $(".alert").removeClass('hidden')
                                // $(".alert").addClass('show')
                                // $('.alert').remove
                                // mostraAlerta({message: `Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`, class: 'danger'})
                            
                                // var indiceLinguagem = null;
                                // var synth = window.speechSynthesis;
                                // console.log(synth)
                                // var voz = synth.getVoices();
                                // console.log(voz)
                                // for(var i = 0; i < voz.length; i++){
                                //     var option = document.createElement('option')
                                //     option.textContent = voz[i].name + ' (' + voz[i].lang + ')'
                                //     option.value = i
                                //     if(option.text ==  "Spanish (Latin America)"){// "Portuguese (Brazil) (pt-BR)"){
                                //         indiceLinguagem = option.value
                                //         console.log("AQUI: "+indiceLinguagem, option.innerText)
                                //     }
                                //     console.log(option)
                                // }
                                
                                // var utterThis = new SpeechSynthesisUtterance(`Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`)
                                // utterThis.voice = voz[indiceLinguagem]
                                // synth.speak(utterThis)
                            
                                // $.notify(`Possivel vazamento de gas ${ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1]["SENSORG"]} | ${ultimoValor.data[0].usuarioTelemetria[ultimoValor.data[0].usuarioTelemetria.length - 1]['NOME']}`, 'error')
                            // }
                        }
                    }
                }
            },
            error: function(error){
                console.log(error.responseText)
                alert(error.responseText)
            }
        })

        // $.ajax({
        //     url: url,
        //     type: "GET",
        //     success : function(response){
        //         // console.log(response)
        //         // JSON.stringify(response)
        //         var ultimoValor = response
        //         console.log(ultimoValor.data.length)
        //         console.log(ultimoValor.data[ultimoValor.data.length - 1]["SENSORG"])
        //         console.log(ultimoValor.data[ultimoValor.data.length - 1])
                
        //         if(ultimoValor.data[ultimoValor.data.length - 1]["SENSORG"] < valorGas){
        //             // alert("URGENTE VERIFICAR POSSIVEL VAZAMENTO DE GAS!!!")
        //             // $(".alert").removeClass('hidden')
        //             // $(".alert").addClass('show')
        //             // $('.alert').remove
        //             // mostraAlerta({message: `Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`, class: 'danger'})
                   
        //             // var indiceLinguagem = null;
        //             // var synth = window.speechSynthesis;
        //             // console.log(synth)
        //             // var voz = synth.getVoices();
        //             // console.log(voz)
        //             // for(var i = 0; i < voz.length; i++){
        //             //     var option = document.createElement('option')
        //             //     option.textContent = voz[i].name + ' (' + voz[i].lang + ')'
        //             //     option.value = i
        //             //     if(option.text ==  "Spanish (Latin America)"){// "Portuguese (Brazil) (pt-BR)"){
        //             //         indiceLinguagem = option.value
        //             //         console.log("AQUI: "+indiceLinguagem, option.innerText)
        //             //     }
        //             //     console.log(option)
        //             // }
                    
        //             // var utterThis = new SpeechSynthesisUtterance(`Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`)
        //             // utterThis.voice = voz[indiceLinguagem]
        //             // synth.speak(utterThis)
                
        //             $.notify(`Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`, 'error')

        //         }
        //     }, 
        //     error: function(response){
        //         console.log(response)
        //         alert(response)
        //     } 
        // })

    }, 15000)
}


