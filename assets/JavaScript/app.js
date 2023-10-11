$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'pizzas', vermais = false) => {
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
            if (vermais && i >= 8 && i < 12) {
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
        var ativo = $('.container-menu a.active').attr('id').split('menu-')[1]  // [menu-][pizzas]
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
        }
        else {
            $("#modal-carrinho").addClass('hidden')
        }

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
    <div class="col-3 mb-5">
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
    `

}