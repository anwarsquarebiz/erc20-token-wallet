// https://github.com/uzyn/ERC20-TST
const abi = JSON.parse(
  '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}]'
);
const decimals = 18;
const tokenSymbol = "RSCT";
contractInstance = web3.eth
  .contract(abi)
  .at("0xC275865a6Cce78398e94CB2Af29fa0d787b7F7Eb");

function displayProviderInfo() {
  document.getElementById("main").innerHTML =
    'No compatible wallet provider found. Please install <a target="_blank" href="https://metamask.io/">Metamask</a>.';
}

function startApp() {
  document.getElementById("tokenSymbol").innerHTML = tokenSymbol;
  var account = "";
  var accountInterval = setInterval(function() {
    if (typeof web3.eth.accounts[0] == "undefined") {
      account = "";
      document.getElementById("address").innerHTML = "";
      document.getElementById("ethBalance").innerHTML = "";
      document.getElementById("tokenBalance").innerHTML = "";
      document.getElementById("transferResult").innerHTML = "";
    } else if (web3.eth.accounts[0] !== account) {
      account = web3.eth.accounts[0];
      document.getElementById("address").innerHTML = account;

      web3.eth.getBalance(account, function(error, result) {
        if (error) {
          document.getElementById("ethBalance").innerHTML =
            "getBalance error: ${err}";
        } else {
          document.getElementById("ethBalance").innerHTML = web3.fromWei(
            result
          );
        }
      });

      contractInstance.balanceOf.call(account, function(error, result) {
        if (error) {
          document.getElementById("tokenBalance").innerHTML =
            "balanceOf error: ${err}";
        } else {
          document.getElementById("tokenBalance").innerHTML =
            result * 10 ** -decimals + " " + tokenSymbol;
        }
      });
    }
  }, 100);
}

function transferTokens() {
  document.getElementById("transferResult").innerHTML = "";

  var transferValue = document.getElementById("transferValue").value;
  var regex = /[0-9]|\./;
  if (!isNumeric(transferValue)) {
    document.getElementById("transferResult").innerHTML =
      "Invalid transfer value";
    return;
  }

  var recipientAddress = document.getElementById("recipientAddress").value;
  if (!recipientAddress.startsWith("0x")) {
    recipientAddress = "0x" + recipientAddress;
  }
  if (!recipientAddress || !web3.isAddress(recipientAddress)) {
    document.getElementById("transferResult").innerHTML =
      "Invalid ethereum address";
    return;
  }

  transferValue = transferValue * 10 ** decimals;
  contractInstance.transfer(recipientAddress, transferValue, function(
    error,
    result
  ) {
    if (error) {
      document.getElementById("transferResult").innerHTML = error;
    } else {
      document.getElementById("transferResult").innerHTML =
        '<a target="_blank" href="https://etherscan.io/tx/' +
        result +
        '">Click to view transaction on etherscan.io</a>';
    }
  });
}

function isNumeric(value) {
  var regex = /[0-9]|\./;
  return regex.test(value);
}
