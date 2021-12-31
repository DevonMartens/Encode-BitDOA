// SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), Ownable {
    uint256 constant initialSupply = 10000;
    using Counters for Counters.Counter;
    Counters.Counter private _paymentIds;
    enum PaymentType { UNKNOWN, BASIC, REFUND, DIVIDEND, GROUP }
    uint8 private paymentTypeEnumCount = 4;
    PaymentType constant defaultPaymentType = PaymentType.UNKNOWN;
    
    struct Payment {
        uint256 paymentId;
        uint256 amount;
        address to;
        PaymentType paymentType;
        string comment;
        uint256 timestamp;
    }
    
    mapping(address => Payment[]) public payments;
    address administrator;
    
    event TotalSupplyIncreased(uint256);
    
    constructor() {
        _mint(msg.sender, initialSupply);
        administrator = msg.sender;
    }
    
    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender, _quantity);
        emit TotalSupplyIncreased(_quantity);
    }
    
    function getPayments(address _addr) public view returns (Payment[] memory) {
        return payments[_addr];
    }

    function viewPayments() public view returns (Payment[] memory) {
        return payments[msg.sender];
    }
    
    function transfer(address _recipient, uint256 _amount) public virtual override returns (bool) {
        _paymentIds.increment();

        _transfer(msg.sender, _recipient, _amount);
        recordPayment(msg.sender, _recipient, _amount);
        return true;
    }
    
    function recordPayment(address _sender, address _recipient, uint256 _amount) internal {
        payments[_sender].push(Payment(_paymentIds.current(), _amount, _recipient, defaultPaymentType, "", block.timestamp));
    }

    function updatePaymentDetails(uint256 _paymentId, uint8 _paymentType, string memory _comment) public {
        (Payment[] storage addressPayments, Payment memory payment, uint i) = findPayment(msg.sender, _paymentId, _paymentType);
        
        payment.paymentType = PaymentType(_paymentType);
        payment.comment = bytes(payment.comment).length == 0 ? _comment : string(abi.encodePacked(payment.comment, "; ", _comment));
        addressPayments[i] = payment;

        payments[msg.sender] = addressPayments;
    }

    function updatePaymentDetailsAdmin(address _payer, uint256 _paymentId, uint8 _paymentType) public {
        require(msg.sender == administrator, "VolcanoCoin: You are not the administrator");        
        (Payment[] storage addressPayments, Payment memory payment, uint i) = findPayment(_payer, _paymentId, _paymentType);        

        payment.paymentType = PaymentType(_paymentType);
        payment.comment = bytes(payment.comment).length == 0 ? string(abi.encodePacked("updated by ", string(abi.encodePacked(administrator)))) : string(abi.encodePacked(payment.comment, "; updated by ", string(abi.encodePacked(administrator))));
        addressPayments[i] = payment;

        payments[_payer] = addressPayments;
    }

    function findPayment(address _payer, uint256 _paymentId, uint8 _paymentType) private view returns (Payment[] storage, Payment memory, uint) {
        require(_paymentType <= paymentTypeEnumCount, "VolcanoCoin: PaymentType is not a valid value");
        
        Payment[] storage addressPayments = payments[_payer];
        require(addressPayments.length > 0, "VolcanoCoin: No payments found for this address");

        Payment memory returnPayment;
        uint index;

        for (uint i=0; i< addressPayments.length; i++) {
            Payment memory payment = addressPayments[i];

            if (_paymentId == payment.paymentId) {
                index = i;
                returnPayment = payment;
                break;
            }
        }

        require(returnPayment.paymentId != 0, "VolcanoCoin: Payment not found");

        return (addressPayments, returnPayment, index);
    }
    
}