var valorPorNumero = 1.99; // Valor fixo por número
var contadorInterval;
var numerosSorteados = []; // Array para armazenar todos os números sorteados
var tempoRestante = 90; // Tempo restante em segundos


function sortearNumeros() {
    var quantidade = document.getElementById('quantidade').value;
    var numerosSorteadosNestaRodada = [];

    for (var i = 0; i < quantidade; i++) {
        var numeroSorteado;
        do {
            numeroSorteado = Math.floor(Math.random() * 100000) + 1;
        } while (numerosSorteados.includes(numeroSorteado));

        numerosSorteados.push(numeroSorteado);
        numerosSorteadosNestaRodada.push(numeroSorteado);
    }

    var valorTotal = quantidade * valorPorNumero;
    document.getElementById('numerosSorteados').innerText = "Números sorteados: " + numerosSorteadosNestaRodada.join(", ") + "\n" + "Valor total: R$ " + valorTotal.toFixed(2);

    // Salvar todos os números sorteados em localStorage
    localStorage.setItem("numerosSorteados", JSON.stringify(numerosSorteados));
}

function gerarQRCode() {
    var quantidade = document.getElementById('quantidade').value;
    var valorTotal = quantidade * valorPorNumero;
    var chavePix = "64999475152"; // Chave PIX fornecida

    // Adiciona 90 segundos ao tempo atual para definir o vencimento
    var dataVencimento = new Date();
    dataVencimento.setSeconds(dataVencimento.getSeconds() + tempoRestante);

    var textoQR = "000201010212" + "26630014" + "br.gov.bcb.pix" + chavePix.length.toString().padStart(2, "0") + chavePix + "52040000" + valorTotal.toFixed(2).replace(".", "").padStart(10, "0") + "53039865404" + "54" + dataVencimento.toISOString().slice(2,19).replace(/[^0-9]/g, ''); // Adiciona o tempo de expiração

    var tipoQR = 6; // Código QR do tipo Alphanumeric

    var qr = qrcode(typeNumber = tipoQR, errorCorrectLevel = 'L');
    qr.addData(textoQR);
    qr.make();

    var elementoQR = document.getElementById('qrCode');
    elementoQR.innerHTML = qr.createImgTag(8, 0);
    elementoQR.style.display = "block";

    // Retorna o texto do código QR gerado
    return textoQR;
}
var codigoQR = gerarQRCode();
console.log(codigoQR); // Exemplo de como utilizar o código QR


function iniciarContagemRegressiva() {
    var elementoTempo = document.getElementById('tempoRestante');
    elementoTempo.style.display = "block";

    var elementoContador = document.getElementById('contador');

    if (contadorInterval) clearInterval(contadorInterval);
    
    tempoRestante = 90; // Reinicia o tempo restante ao iniciar uma nova contagem

    contadorInterval = setInterval(function() {
        if (tempoRestante <= 0) {
            clearInterval(contadorInterval);
            elementoContador.innerText = "Tempo esgotado";
            return;
        }
        var minutos = Math.floor(tempoRestante / 60);
        var segundos = tempoRestante % 60;
        elementoContador.innerText = minutos + " minuto(s) e " + segundos + " segundo(s)";
        tempoRestante--;
    }, 1000);
}


function exibirPix() {
    var numerosSorteados = getNumerosSorteados();
    if (numerosSorteados.length === 0) {
        sortearNumeros();
    }
    gerarQRCode();
    
    var quantidade = document.getElementById('quantidade').value;
    var valorTotal = quantidade * valorPorNumero;

    var infoPix = codigoQR = gerarQRCode();;
    infoPix += "Valor total a pagar: R$ " + valorTotal.toFixed(2);

    document.getElementById('infoPix').innerText = infoPix;
    document.getElementById('infoPix').style.display = "block";

    // Exibir botão de copiar código PIX
    document.getElementById('copiarCodigoQR').style.display = "inline-block";

    iniciarContagemRegressiva();
}



function copiarCodigoQR() {
    var elementoQR = document.getElementById('qrCode');
    var codigoQR = elementoQR.innerHTML; // Obtém o conteúdo HTML do QR code

    // Cria um elemento input temporário
    var inputTemporario = document.createElement("textarea");
    inputTemporario.textContent = codigoQR; // Define o texto do elemento input como o código QR

    // Adiciona o elemento temporário ao corpo do documento
    document.body.appendChild(inputTemporario);

    // Seleciona todo o texto no elemento input
    inputTemporario.select();
    inputTemporario.setSelectionRange(0, 99999); // Para dispositivos móveis

    // Copia o texto selecionado
    document.execCommand("copy");

    // Remove o elemento temporário
    document.body.removeChild(inputTemporario);

    // Alerta o usuário que o código QR foi copiado
    alert("O código QR foi copiado para a área de transferência!");
}



function getNumerosSorteados() {
    var numerosSorteados = JSON.parse(localStorage.getItem("numerosSorteados"));
    return numerosSorteados ? numerosSorteados : [];
}
