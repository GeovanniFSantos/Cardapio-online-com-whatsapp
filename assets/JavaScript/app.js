$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALO_CARRINHO = 0;
var VALOR_ENTREGA = 5.5;

var CELULAR_EMPRESA = '5575991674387';

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar()
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.abrirConversaSocial();
    }

}

cardapio.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'pizzasTradicional', vermais = false) => {
        var filtro = MENU[categoria]
        console.log(filtro)

        if (!vermais) {
            $("#itensCardapio").html('')
            $('#btnVErMais').removeClass('hidden');
        }

        // forEach do elemento dos itens
        $.each(filtro, (i, element) => {
            let temp = cardapio.templates.item
                .replace(/\${img}/g, element.img)
                .replace(/\${name}/g, element.name)
                .replace(/\${price}/g, element.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, element.id)

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 15) {
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }
        })

        // remove o ativo
        $(".container-menu a").removeClass('active');

        // adiciona ativo na categoria atual
        $("#menu-" + categoria).addClass('active');

    },

    // clique no botão de ver mais
    verMais: () => {
        var ativo = $('.container-menu a.active').attr('id').split('menu-')[1];  // [menu-][pizzas]
        cardapio.metodos.obterItensCardapio(ativo, true)

        $('#btnVErMais').addClass('hidden');
    },

    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // adicionar Itens ao carrinho
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            // obter a categoria Ativa
            var categoria = $('.container-menu a.active').attr('id').split('menu-')[1]

            // obtem a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso já exista, só altera a quantidade do carrinho
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // cado ainda não exista o item no carrinho, adiciona ele
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem("Item adicionado ao carrinho!", 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.adicionarBadgeTotal();
            }
        }
    },

    // atualizar valores do carrinho
    adicionarBadgeTotal: () => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass("hidden");
            $(".container-total-carrinho").removeClass("hidden");
        }
        else {
            $(".botao-carrinho").addClass("hidden")
            $(".container-total-carrinho").addClass("hidden");
        }
        $(".badge-total-carrinho").html(total)
    },

    // abrir Modal de Carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modal-carrinho").removeClass('hidden')
            cardapio.metodos.carregarCarrinho()
        }
        else {
            $("#modal-carrinho").addClass('hidden')
        }

    },

    // altera os texto e exibe os botões das etapas 
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text("Seu carrinho:");
            $("#itensCarrinhos").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden')
            $("#btnEtapaEndereco").addClass('hidden')
            $("#btnEtapaResumo").addClass('hidden')
            $("#btnVoltar").addClass('hidden')

        }

        if (etapa == 2) {
            $("#lblTituloEtapa").text("Endereço de entrega:");
            $("#itensCarrinhos").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden')
            $("#btnEtapaEndereco").removeClass('hidden')
            $("#btnEtapaResumo").addClass('hidden')
            $("#btnVoltar").removeClass('hidden')

        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text("Resumo do pedido:");
            $("#itensCarrinhos").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden')
            $("#btnEtapaEndereco").addClass('hidden')
            $("#btnEtapaResumo").removeClass('hidden')
            $("#btnVoltar").removeClass('hidden')
        }

    },

    // botão de voltar etapas
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1)
    },

    // Carregar a lista de itens do carrinho selecionado
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1)

        if (MEU_CARRINHO.length > 0) {
            $("#itensCarrinhos").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho
                    .replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id)
                    .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinhos").append(temp);

                // útimo item do carrinho + soma
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })
        }
        else {
            $("#itensCarrinhos").html('<p class="carrinho-vazio"> <i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }
    },

    // Diminuir a quantidade do produto no carrinho
    diminuirQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1)
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        } else {
            cardapio.metodos.removerItemCarrinho(id);
        }
    },

    // Aumentar a quantidade de item do carrinho
    aumentarQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },

    // Deletar item do carrinho
    removerItemCarrinho: (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.adicionarBadgeTotal();

    },

    // Atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.adicionarBadgeTotal();

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();
    },

    // Carregar valores subtotal e total
    carregarValores: () => {
        VALO_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {
            VALO_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALO_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALO_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }
        })
    },

    // carregar a etapa endereços
    carregarEndereco: () => {
        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        }
        cardapio.metodos.carregarEtapa(2);
    },

    // API viaCEP
    buscarCep: () => {
        // Cria a variavel com o valor do cep
        var cep = $("#textCEP").val().trim().replace(/\D/g, '')
        // verifica se o CEO possui valor informado
        if (cep != "") {
            // Expressão regular para validar o CEP
            var validarCep = /^[0-9]{8}$/;

            if (validarCep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                    // Se tiver dados ele vai preenche-los no campo
                    if (!("erro" in dados)) {
                        // Atualizar os campos retornados
                        $("#textEndereco").val(dados.logradouro);
                        $("#textBairro").val(dados.bairro);
                        $("#textCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#textNumero").focus();

                    } else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informaçôes manualmente.');
                        $("#textCEP").focus();
                    }
                })
            } else {
                cardapio.metodos.mensagem('Formato do CEP inválido.')
                $("#textCEP").focus();
            }

        }
        else {
            cardapio.metodos.mensagem("Informe o CEP, por favor.");
            $("#textCEP").focus();
        }
    },

    // validação antes de prosseguir para etapa 3
    resumoPedido: () => {
        let cep = $("#textCEP").val().trim();
        let endereco = $("#textEndereco").val().trim();
        let bairro = $("#textBairro").val().trim();
        let cidade = $("#textCidade").val().trim();
        let numero = $("#textNumero").val().trim();
        let complemento = $("#textComplemento").val().trim();
        let uf = $("#ddlUf").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.')
            $("#textCEP").focus();
            return;
        }
        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.')
            $("#textEndereco").focus();
            return;
        }
        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.')
            $("#textBairro").focus();
            return;
        }
        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe o Cidade, por favor.')
            $("#textCidade").focus();
            return;
        }
        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.')
            $("#textNumero").focus();
            return;
        }
        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe o UF, por favor.')
            $("#ddlUf").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }
        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo()
    },

    // Carrega a etapa de resumo do pedido selecionados
    carregarResumo: () => {
        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {
            let temp = cardapio.templates.itemResumo
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);

        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`)
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`)

        cardapio.metodos.finalizarPedido();
    },

    // Atualizar o link do botão do WhatsApp
    finalizarPedido: () => {
        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
            var texto = 'Olá! Gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*'
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} / ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALO_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {
                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.', ',')} \n`
                // útimo item
                if ((i + 1) == MEU_CARRINHO.length) {
                    texto = texto.replace(/\${itens}/g, itens);
                    // convert a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);
                }
            })
        }
    },

    // Carregar o link do botão reserva
    carregarBotaoReserva: () => {

        var textoReserva = 'Olá! gostaria de fazer uma *reserva*'

        // convert a URL
        let encodeReserva = encodeURI(textoReserva);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encodeReserva}`;

        $("#btnReserva").attr('href', URL);
    },

    // carregar botão de ligar
    carregarBotaoLigar: () => {
        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`)
    },

    // abri os depoimentos
    abrirDepoimento: (depoimento) => {
        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden')
        $("#btnDepoimento-" + depoimento).addClass('active')

    },

    //
    abrirConversaSocial: () => {
        var textoSocial = 'Olá!'

        // convert a URL
        let encodeSocial = encodeURI(textoSocial);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encodeSocial}`;

        $("#btnWtzpSocial").attr('href', URL);
    },

    // mensagem personalizado para alert 
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id='msg-${id}' class="animated fadeInDown toast ${cor}">${texto}</div>`

        $("#container-mensagens").append(msg)

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();

            }, 800);
        }, tempo)

    }
}

cardapio.templates = {

    item: `
    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 wow fadeInUp">
         <div class="card card-item" id="\${id}">
             <div class="img-produto">
                <img src="\${img}" />
             </div>
             <p class="title-produto text-center mt-4">
             <b>\${name}</b>
             </p>
             <p class="price-produto text-center">
             <b>R$ \${price}</b>
             </p>
             <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
             </div>
         </div>
    </div>
    `,

    itemCarrinho: `
    <div class="col-12 item-carrinho">
        <div class="img-produto">
             <img src="\${img}" />
        </div>

        <div class="dados-produto">
            <p class="title-produto"><b>\${name}</b></p>
            <p class="price-produto"><b>R$  \${price}</b></p>
        </div>

        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
        </div>
    </div>
    `,

    itemResumo: `
    <div class="col-12 item-carrinho resumo">
        <div class="img-produto-resumo">
            <img src="\${img}" alt="">
        </div>

        <div class="dados-produto">
            <p class="title-produto-resumo"><b>\${name}</b></p>
            <p class="price-produto-resumo"><b>R$ \${price}</b></p>
        </div>
            <p class="quantidade-produto-resumo">x <b>\${qntd}</b></p>
    </div>
    `

}