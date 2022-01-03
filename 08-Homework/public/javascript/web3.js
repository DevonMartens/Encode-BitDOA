$(document).ready(() => {
   
    console.log('web3 connected');

    connectWallet();

    window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        connectWallet();
        console.log('Account has changed');
    });

    $('#mint-nft').click(async () => {
        $("body").addClass("loading");

        const response = await mintNft();

        showNftMetadata();

        $('#success').show();
        $("body").removeClass("loading");
    });

    $('#transfer-nft').click(async () => {
        $("body").addClass("loading");
        const tokenId = document.getElementById('transfer-tokenid');
        const address = document.getElementById('transfer-address');

        const response = await transferNft(address.value, tokenId.value);
        showNftMetadata();
        $("body").removeClass("loading");
        address.value = "";
        tokenId.value = "";
    });
});

function connectWallet() {
    loadProvider().then((response) => {
        $('#mint').show();
        // showNftMetadata();
    });
}

// function showNftMetadata() {
//     getMetadata().then((response) => {
//         if (response.length > 0) {
//             const newHtml = response.map(meta => `<span>${meta[2]}</span><br/>`);
//             $('#account-metadata').html(newHtml.join("")).show();
//             $('#transferSpan').show();
//         } else {
//             $('#account-metadata').html('').hide();
//             $('#transferSpan').hide();
//         }
//     });
// }
  
async function addData(newData) {
    const route = 'mintNft';
    const req = { data: newData };
    function update(response) {
        $('#output-text').val(response.path);
    }
    ajaxCall(route, req, update);
}