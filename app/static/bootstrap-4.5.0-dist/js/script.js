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

// var btnEnviar = document.getElementById("submit")
// btnEnviar.addEventListener("click", function(){
//     $("#cpf").tooltip({"title": "TESTANDO VALIDACAO CPF TOOLTIP"});
// })


// window.setInterval(function() {
//     console.log("passou 30 segundos");
//     console.log(document.cookie);

//     if(document.cookie == null || document.cookie.length <= 0){
//         if(document.URL.split("/")[4] == "login"){
//             console.log("JA ESTOU NA PAGINA DE LOGIN");
//         }else if(document.URL.split("/")[4] == "register" || document.URL.split("/")[4] == "register" || document.URL.split("/")[4] == "recuperar" || document.URL.split()[4] == "recuperar"){
//             // alert(document.cookie);
//             console.log("NADA A FAZER");
//         }else {
//             voltaPaginaPrincipal();
//         }
//     }
// }, 30000); // 15 min 900000

// var el = document.querySelectorAll('.form-control') 
// for(i of el){
//     i.classList.add('border-bottom')
// }


// formulario = () => {  // arrow function
    
// var $ = jQuery



// window.addEventListener('click', formulario)


// formularioBlur = () => {
    
        
        
// }

// window.addEventListener('blur', formularioBlur)


// document.querySelectorAll('#email')[0].addEventListener('click', function(){ 
//     console.log('AQUI TESTE LOGIN')
//     $('#email').addClass('border-bottom border-primary rounded-0')
// })


// document.querySelectorAll('#email')[0].addEventListener('click', function(){ 
// // $(document).ready(function () {
//     $("#email").blur(function () {
//         $(this).removeClass('border-primary')
//     })
// })
// })



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
            // var dados = JSON.parse(response);
            // console.log(dados.dados);
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
                // $("#usuario_id option").filter(function() {
                //     return $(this).value == response.dadosUsuario;
                // }).prop("selected", true);
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
            // var dados = JSON.parse(response);
            // console.log(dados.dados);
           
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
            if (response.dadosTipoUsuario == false){
                $("#tipoUsuario option").filter(function() {
                    return $(this).text() == "ADMINISTRADOR";
                }).prop("selected", true);
            }else if (response.dadosTipoUsuario == true) {
                $("#tipoUsuario option").filter(function() {
                    return $(this).text() == "COMUM";
                }).prop("selected", true);
            }           
        }
    }); 
}


function voltaPaginaPrincipal(){
    window.location.href = 'https://192.168.0.13:59000/form/login';
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
                // $("#endereco").html(response.logradouro);
                // document.getElementById('bairro').innerHTML = response.bairro;
                // $('#cidade').html(response.localidade);
                // document.getElementById('estado').innerHTML = response.uf;
                document.querySelectorAll('.show')[0].querySelector('#bairro').value = response.bairro;
                document.querySelectorAll('.show')[0].querySelector('#cidade').value = response.localidade;
                document.querySelectorAll('.show')[0].querySelector('#estado').value = response.uf;
                document.querySelectorAll('.show')[0].querySelector('#endereco').value = response.logradouro;
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
            // $("#endereco").html(response.logradouro);
            // document.getElementById('bairro').innerHTML = response.bairro;
            // $('#cidade').html(response.localidade);
            // document.getElementById('estado').innerHTML = response.uf;
            // document.querySelectorAll('.show')[0].querySelector('#bairro').value = response.bairro;
        }
    })
}


function chamaTelemetria(){
   
    var tabela = $('#myTable').DataTable({
        "ajax": "https://192.168.0.13:59000/telemetria/listarTelemetriaJson",
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
                console.log(response.data)
                $.each(response.data.usuariosIdNome, function(i, d){ // i - value | d - texto/informaçao 
                    // $('<option>').val(i).text(d[1]).appendTo(options);
                    if(response.data.usuariosIdNome.length == $("#formAdicionarConfig #usuario_id option").length){
                        // console.log(cont)
                    }else{
                        $('#formAdicionarConfig #usuario_id').append($('<option>', { "value" : i+1 }).text(d[1]))  // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
                    }
                })
            }
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
            if($('#formAdicionarConfig #tempoTelemetria').val() == ''){
                $('#formAdicionarConfig').addClass('needs-validation')
                $('#formAdicionarConfig #tempoTelemetria').addClass('is-invalid')
                $('<div/>', {
                    'class': 'invalid-feedback'
                }).appendTo('#formAdicionarConfig .form-group')
                $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
            }else {
                
                $('.invalid-feedback').fadeOut(1600, function() {
                   $('#formAdicionarConfig #tempoTelemetria').removeClass('is-invalid')
                   $('#formAdicionarConfig #tempoTelemetria').removeClass('invalid-feedback')
                        
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
                }

                var data = {
                    tempoTel: Number.parseFloat($('#formAdicionarConfig #tempoTelemetria').val()),
                    tempoGeo: Number.parseFloat($('#formAdicionarConfig #tempoGeolocalizacao').val()),
                    tempoSoneca: Number.parseFloat($('#formAdicionarConfig #tempoSoneca').val()),
                    tempoThingSpeak: Number.parseFloat($('#formAdicionarConfig #tempoThingSpeak').val()),
                    urlIpApi: $('#formAdicionarConfig #urlIpApi').val(),
                    urlThingSpeak: $('#formAdicionarConfig #urlThingSpeak').val(),
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
                    console.log('Erro ao inserir nova configuraçaoo'+ data + err + opt)
                    $.notify('Erro ao inserir nova configuraçao'+ data + err + opt, 'error')
                })
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

    configuraSelectConfig("#formConfigEdit ")
    
   
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
        // if($('#formConfigEdit #urlIpApi').val() == null || $('#formConfigEdit #urlIpApi').val() == ''){
        //     $('#formConfigEdit').addClass('needs-validation')
        //     $('#formConfigEdit #urlIpApi').addClass('is-invalid')
        //     $('.invalid-feedback').html('Campo vazio nao permitido favor preencher')
        // }else{
        //     $('#formConfigEdit').removeClass('needs-validation')
        //     $('#formConfigEdit #urlIpApi').removeClass('is-invalid')
        //     $('.invalid-feedback').html('')
        // }


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
        }

    
        // $('#formConfigEdit #urlIpApi').val()
        var data = {
            id: Number.parseInt($("#id").val()),
            tempoTel: Number.parseFloat($('#tempoTel').val()),
            tempoGeo: Number.parseFloat($('#tempoGeo').val()),
            tempoSoneca: Number.parseFloat($('#tempoSoneca').val()),
            tempoThingSpeak: Number.parseFloat($('#tempoThingSpeak').val()),
            urlIpApi: $('#urlIpApi').val(),
            
            urlThingSpeak: $('#urlThingSpeak').val(),
            secretKey: $('#secretKeyThingSpeak').val(),
            resetarConfigsWifi: Number.parseInt($('#resetarConfigsWifi').val()),
            alertaEmail: Number.parseInt($('#alertaEmail').val()),
            valorGasAviso: Number.parseFloat($('#valorGasAviso').val()),
            usuarioId: Number.parseInt(($('#usuario_id').val()))
        }
        console.log(data)
        console.log(JSON.stringify(data))
        alert($("#formConfigEdit #csrf_token").val())

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
            $('#formConfigEdit #secretKeyThingSpeak').val(""),
            $('#formConfigEdit #resetarConfigsWifi').val(""),
            $('#formConfigEdit #alertaEmail').val(""),
            $('#formConfigEdit #valorGasAviso').val(""),
            $('#formConfigEdit #usuario_id').val(""),
            $("#modal-edit").modal("hide")
            console.log(data)
            alert(data)
            $.notify('Sucesso ao atualizar o registro de configuraçoes', 'success')
            tabelaConfig.ajax.reload()
        }).fail(function(data, err, opt){
            console.log('Erro ao atualizar o registro de configuraçoes'+ data.responseText) // + err + opt)
            $.notify('Erro ao atualizar o registro de configuraçoes'+ data + err + opt, 'error')
        })
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
            alert(data)
            $.notify('Sucesso ao inserir o registro de local', 'success')
            tabelaLocal.ajax.reload()

        }).fail(function(data, err, opt){
            console.log('Erro ao inserir o registro de local'+ data.responseText + err + opt)
            $.notify('Erro ao inserir o registro de local'+ data + err + opt, 'error')
        })
    })
    
    pegaToken($("#formLocalAdicionar #csrf_token").val())
}


function editaLocalJson(tabelaLocal){
    console.log("aqui edita")
    
   
    // $("#alertaEmail").append($('<option>', {
    //     value: 0,
    //     text: 'NAO'
    // }))

    $("#myTable").on("click", ".btn-outline-warning", function (e) {
        console.log(e.target.id, typeof(e.target.id))
        // var id = $(this).data('id');
        
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
                        $('#usuario_id').append($('<option>', { "value" : i+1 }).text(d[1])) // ou usar o d[1] mas tem que pegar a primeira posiçao do array ex: [1, 'admin']
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

    $("#edit_action").click(function(e){
        e.preventDefault();
      
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

    
        // $('#formConfigEdit #urlIpApi').val()
        var data = {
            id: Number.parseInt($("#id").val()),
            cep: ($('#cep').val()),
            endereco: ($('#endereco').val()),
            bairro: ($('#bairro').val()),
            cidade: ($('#cidade').val()),
            estado: ($('#estado').val()),
            obs: $('#obs').val(),
            nomeUsuario: Number.parseInt($('#usuario_id').val())
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
            $('#formLocalEdit #cep').val(""),
            $('#formLocalEdit #endereco').val(""),
            $('#formLocalgEdit #cidade').val(""),
            $('#formLocalEdit #bairro').val(""),
            $('#formLocalEdit #estado').val(""),
            $('#formLocalEdit #obs').val(""),
            $('#formLocalEdit #nomeUsuario').val(""),
            
            // $('#formConfigEdit #nomeUsuario').val(""),
            $("#modaledit").modal("hide")
            console.log(data)
            alert(data)
            $.notify('Sucesso ao atualizar o registro de local', 'success')
            tabelaLocal.ajax.reload()

        }).fail(function(data, err, opt){
            console.log('Erro ao atualizar o registro de local'+ data.responseText + err + opt)
            $.notify('Erro ao atualizar o registro de local'+ data + err + opt, 'error')
        })
    })
    
    pegaToken($("#formLocalEdit #csrf_token").val())
}



function insereInfoJson(tabelaInfo){

    $(".btn-outline-success").click(function(){

        $.ajax({
            url: "/informacao/listarInfoJson",
            type: "GET"
        }).done(function(response) {

            var valores = [ $("#formInfoAdicionar #sensores_id option").length, $("#formInfoAdicionar #local_id option").length , $("#formInfoAdicionar #modulo_id option").length ]
            
            $.each(response.dados, function(i, d){ // como o dados esta vindo como um vetor/lista temos que percorre-lo e depois pegar atraves do parametro d os campos do json que queremos i - indice | d - campos do json nesse caso
                console.log("API "+ d.sensores.length)               
               
                if(d.sensores.length == valores[0]){
                    console.log(d.sensores)                    
                }else {
                    $.each(d.sensores, function(i, d){
                        $("#formInfoAdicionar #sensores_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                    })
                }

                console.log("API "+ d.sensores.length)
                if(d.local.length == valores[1]){
                    console.log(d.local)
                }else{
                    $.each(d.local, function(i, d){
                        $("#formInfoAdicionar #local_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                    })
                }

                if(d.modulos.length == valores[2]){
                    console.log(d.modulos)                    
                }else{
                    $.each(d.modulos, function(i, d){
                        $("#formInfoAdicionar #modulo_id").append($('<option>', { "value" : d[0] }).text(d[1]))
                    })
                }
                    
            })

        }).fail(function(data, err, opt){
            console.log('Erro ao inserir informaçao' + data.responseText + err + opt)
            $.notify('Erro ao inserir informaçao' + data , 'error')
        })
    })

    $("#submit_action").click(function(evento){
        evento.preventDefault()

        var data = {
            id: Number.parseInt($("#formInfoEdit #id").val()),
            id_sensores: Number.parseInt($("#formInfoEdit #sensores_id").val()),
            id_local: Number.parseInt($("#formInfoEdit #local_id").val()),
            id_modulos: Number.parseInt($("#formInfoEdit #modulo_id").val())
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
            $.notify('Erro ao inserir informaçao' + data.responseText + err + opt, 'error')
        })
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
             
                // var testeTamanho = $.map($("#sensores_id"), function(e){
                //     return e.length
                // })

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
    // $.ajaxSetup({
    //     beforeSend: function(xhr, settings) {
    //         if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
    //             xhr.setRequestHeader("X-CSRFToken", csrf_token)
    //         }    
    //     }
    // })



    // tabela.addEventListener('click', function(e){
 
    // console.log(Object.values(tabelaInfo))
 

    // for(let i = 0; i < btnEdita.length; i++){
    //     // console.log(e.target)
    //         // var tr = tabela.querySelectorAll('tr')
    //         // var cont = 0
    //         // for(lin of tr){
    //         //     console.log(lin.querySelectorAll('td'))
    //         //     for(let linText of lin.querySelectorAll('td')){
    //         //         console.log(linText.outerText)
    //         //     }
    //         // }
    //         btnEdita[i].addEventListener('click', function(e){
    //             alert('OLA HUMANO')
    //         })
    // }
    
    // btnEdita[0].addEventListener('click', function(evento) {
    //     console.log(evento.target.id, typeof(evento.target.id))
    //     alert('OI')
    // })
    

    // document.addEventListener('DOMContentLoaded', function(){
    //     if(btnEdita){
    //         btnEdita.addEventListener('click', function(evento) {
    //             console.log(evento.target.id, typeof(evento.target.id))
    //             alert('OI')
    
    
    //         })
    //     }else{
    //         alert('DEU RUIM CARA')
    //     }
    // })

   
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


function meuMapa(){
    //   var tr = document.querySelectorAll('tr')
    //   for(var i = 0; i < tr.length; i++){
    //     tr[i].getElementsByTagName('td')
    //   }

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
                    // success: function(response){
                    //     // alert(response);
                    //     // tabela.empty();
                    //     console.log(response);
                    // //     // $.each(response.data, function(a, b){
                    // //     //     data = new Date(b["dataCriacao"]);
                    // //     //     let novaData = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
                    // //     //     tabela.append("<tr><td>" + b["id"] + "</td>" + 
                    // //     //     "<td>" + b["NOME"] + "</td>" +
                    // //     //     "<td>" + b["SENSORG"] + "</td>" +
                    // //     //     "<td>" + b["SENSORT"] + "</td>" +
                    // //     //     "<td>" + b["SENSORU"] + "</td>" +
                    // //     //     "<td>" + novaData.toISOString().replace(/\. \d{3}\$/, '') + "</td>" +
                            
                    // //     //     "</tr>");
            
                    // //     // });
            
                    // }
                },
                columns: [
                    {"data": "id"},
                    {"data": "NOME"}, //render: function(data){
                        // var lista = null;
                        // if(data == document.querySelectorAll('.nav-link')[7].text.split(":")[1].replace(" ", "")){
                        //     lista = data;
                        // }
                        // return lista;
                        // }},
                    {"data": "SENSORG", render: function(data){
                        return `${data} PPM`;
                    }},
                    {"data": "SENSORT", render: function(data){
                        return `${data} °C`;
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
                    // data = new Date("dataCriacao"),
                    // console.log(data),
                    // novaData = new Date(data.valueOf() - data.getTimezoneOffset() * 60000),
                    // novaData = novaData.toISOString().replace(/\.\d{3}Z$/, ''),
                    // {novaData}
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
            
        // }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Geolocalizacao"){
        //     var tabela = $(".table").find("tbody");
        //     // var 
        //     var dataFormatada = null;
        //     var novaData = null;

        //     var tabela2 = $('#myTable').DataTable({
        //         ajax: {
        //             url: "/geo/listarGeoJson",
        //             type: "GET",
        //             xhrFields: {
        //                 withCredentials: true
        //             }
        //         //     success: function(response){
        //         //         // alert(response);
        //         //         tabela.empty();
        //         //         console.log(response);
        //         //         $.each(response.data, function(a, b){
        //         //             data = new Date(b["dataCriacao"]);
        //         //             let novaData = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
        //         //             tabela.append("<tr><td>" + b["id"] + "</td>" + 
        //         //             // "<td>" + b["dataCriacao"] + "</td>" +
        //         //             "<td>" + novaData.getUTCDate().toString().padStart(2, '0') + "/" + (novaData.getUTCMonth()+1).toString().padStart(2, '0') + "/" + novaData.getUTCFullYear().toString().padStart(2, '0') + ":" + novaData.getUTCHours().toString().padStart(2, '0') + ":" + novaData.getUTCMinutes().toString().padStart(2, '0') + ":" + novaData.getUTCSeconds().toString().padStart(2, '0') + "</td>" +     //toISOString().replace(/\. \d{3}\$/, '') + "</td>" +
        //         //             "<td>" + b.json["query"] + "</td>" +
        //         //             "<td>" + b.json["status"] + "</td>" +
        //         //             "<td>" + b.json["region"] + "</td>" +
        //         //             "<td>" + b.json["city"] + "</td>" +
        //         //             "<td>" + b.json["zip"] + "</td>" +
        //         //             "<td>" + b.json["lat"] + "</td>" +
        //         //             "<td>" + b.json["lon"] + "</td>" +
        //         //             "<td>" + b.json["NOME"] + "</td>" +
                            
                            
        //         //             "</tr>");
            
        //         //         });
            
        //         //     }
        //         },
        //         columns: [
        //             {"data": "id"},
        //             {"data": "dataCriacao", render: function(data){
        //                 var dataHora = new Date(data)
        //                 var novaDataHora = dataHora.getUTCDate().toString().padStart(2, '0') + "/" + (dataHora.getUTCMonth()+1).toString().padStart(2, '0') + "/" +  dataHora.getUTCFullYear().toString().padStart(2, '0') + " " + dataHora.getUTCHours().toString().padStart(2, '0') + ":" + dataHora.getUTCMinutes().toString().padStart(2, '0') + ":" + dataHora.getUTCSeconds().toString().padStart(2, '0')
        //                 return dataHora.toLocaleString('pt-BR', { timeZone: 'GMT' })       //novaDataHora
        //             }},
        //             {"data": "json.query"},
        //             {"data": "json.status"},
        //             {"data": "json.region"},
        //             {"data": "json.city"}, 
        //             {"data": "json.zip"},
        //             {"data": "json.lat"},
        //             {"data": "json.lon"},
        //             {"data": "json.NOME"},
        //             {
        //                 "data": null, 
        //                 render: function(data, type, row, meta){
        //                     return '<button class="btn btn-outline-info btn-xs" data-toogle="modal" data-target=#modaledit" data-id="' + row.id + '" data-title="' + row.title + '" data-slug="' + row.slug + '" data-text="' + data.json["lat"] + '"><i class="bi bi-eye"></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg> Visualizar </button>';
        //                     // id="btnMapa"  ';
        //                 }
        //             }                
        //             // {"defaultContent": "<button> Visualize </button>"}
        //         ],   
        //         // responsive: {
        //         //     details: {
        //         //         display: $.fn.dataTable.Responsive.display.modal({
        //         //             header: function(row){
        //         //                 var data = row.data();
        //         //                 return "Detalhes de " + data[0] + data[1];
        //         //             }
        //         //         }),
        //         //         renderer: $.fn.dataTable.Responsive.renderer.tableAll({
        //         //             tableClass: 'table'
        //         //         })
        //         //     }
        //         // },       
        //         // dom: 'Bftrip',   
        //         // buttons: [{
        //         //     text: 'Visualizar',
        //         //     action: function(e, dt, node, conf){
        //         //         alert("TESTE CLICK")
        //         //     },
        //         //     className: 'btn btn-outline-info'
        //         // }
        //         // ],
            
        //         "language": {
        //             "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
        //         },
        //         retrieve: true,
        //         paging: true
        //     });
        //     // tabela2.buttons.info('TESTANDO', 3000);
        //     setInterval(function(){
        //         tabela2.ajax.reload();  
        //     }, 30000); // 3 min


        //     function meuMapa(){
        //         //   var tr = document.querySelectorAll('tr')
        //         //   for(var i = 0; i < tr.length; i++){
        //         //     tr[i].getElementsByTagName('td')
        //         //   }
            
        //             var idElemento = document.querySelectorAll(".btn-outline-info")
        //             let idModal;
        //             console.log(idElemento)
        //             for(var i = 0; i < idElemento.length; i++){
        //                 idElemento[i].addEventListener('click', function(e){
        //                     // alert("Elemento clicado foi o " + e.target.id)
        //                     alert(e.target.id)
        //                     console.log(e.target)
                           
        //                     idModal = e.target.id;
        //                     // console.log(e.target.getAttribute('data-lat'))
        //                     // console.log(e.target.getAttribute('data-long'))
        //                     var lat = parseFloat(e.target.getAttribute('data-lat'))
        //                     var long = parseFloat(e.target.getAttribute('data-long'))
        //                     console.log(lat)
        //                     // console.log(idModal.split('btnMapa')[1])
        //                     var mapaProp = {
        //                         center: new google.maps.LatLng(lat, long),
        //                         // center: {lat: lat, lng: long},
        //                         //   center: new google.maps.LatLng(minhaPosicao, idMapa),
        //                         zoom: 14,
        //                         mapTYpeId: 'hybrid',
        //                         scaleControl: true,
        //                         fullscreenControlOptions: {
        //                         position: google.maps.ControlPosition.RIGHT_BOTTOM
        //                         },
        //                     };
            
        //                     var map = new google.maps.Map(
        //                         document.getElementById("googleMap"+idModal.split('btnMapa')[1])    
        //                     , mapaProp);
            
                            
        //                 });
                        
        //             }
        //             console.log(idModal)
            
            
                    
            
                   
                 
                    
        //         }
        //     // $("#myTable tbody").on('click', 'button', function() {
        //     //     var data = tabela2.row( $(this).parents('tr') ).data();

        //     //     tabela.row( $(this).parents('tr') ).select();
        //     //     c = 
        //     // })

        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Usuarios"){
            chamaTabelaEstatica();
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
                            return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"><i class="bi bi-pencil-square"></i> Editar </button>' +
                            ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"><i class="bi bi-trash"></i> Excluir </button>';                      
                           
                        }
                    }
                    // },
                    // {
                    //     "data": null,
                    //     render: function(data, type, full_row, meta){
                    //         return '';
                    //     }
                    
                    // }
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


        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Sensores"){
            chamaTabelaEstatica();
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

            // setInterval(function(){
            //     tabelaModulos.ajax.reload();
            // }, 30000);


        }else if(document.querySelectorAll(".jumbotron")[0].innerText.split("\n")[0] == "Informacao"){
                var novaDataInfo = null;

                var tabelaInfo = $("#myTable").DataTable({
                    ajax: {
                        url: "/informacao/listarInfoJson",
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
                                return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"><i class="bi bi-pencil-square"></i> Editar </button>' +
                                ' <button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'"><i class="bi bi-trash"></i> Excluir </button>' ;
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
                    {"data": "valor_gas_aviso", "visible": false},
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
    
                    {"data": "usuario_id", "visible": false},
                    {
                        "data": null,
                        render: function(data, type, full_row, meta){
                            return '<button type="button" class="btn btn-outline-warning btn-xs" data-toggle="modal" data-target="#modal-edit" data-id="' + full_row.id + '" id="'+ full_row.id +'"><i class="bi bi-pencil-square"></i>  Editar </button>' + 
                            '<button type="button" class="btn btn-outline-danger btn-xs" data-toggle="modal" data-target="#myModal" data-id="' + full_row.id + '" id="'+ full_row.id +'" ><i class="bi bi-trash"></i>  Excluir </button>';
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
        }

        // }
        
        notificaVazamento();
    }
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

    var url = "/telemetria/listarTelemetriaJson"
    var urlConfig = "/config/listarConfigJson"
    var nomeUsuarioLogado = document.querySelectorAll('.nav-link')[8].text.split(': ')[1]
    var idUsuarioLogado = parseInt(document.querySelectorAll('.navbar-nav')[1].querySelectorAll('.nav-item')[0].querySelectorAll('.nav-link')[0].id)
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
                    if(x.id == idUsuarioLogado){
                        valorGas = x.valor_gas_aviso
                        // alert(valorGas)
                    }
                }
                // valorGas.data[""]
            },
            error: function(error){
                console.log(error.responseText)
                alert(error.responseText)
            }
        })

        $.ajax({
            url: url,
            type: "GET",
            success : function(response){
                // console.log(response)
                // JSON.stringify(response)
                var ultimoValor = response
                console.log(ultimoValor.data.length)
                console.log(ultimoValor.data[ultimoValor.data.length - 1]["SENSORG"])
                console.log(ultimoValor.data[ultimoValor.data.length - 1])
                
                if(ultimoValor.data[ultimoValor.data.length - 1]["SENSORG"] < valorGas){
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
                
                    $.notify(`Possivel vazamento de gas ${ultimoValor.data[ultimoValor.data.length - 1]['SENSORG']} | ${ultimoValor.data[ultimoValor.data.length - 1]['NOME']}`, 'error')

                }
            }, 
            error: function(response){
                console.log(response)
                alert(response)
            } 
        })

    }, 15000)
}


